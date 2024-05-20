import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import "./table.scss";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import SelectYear from "./SelectYear";
import SearchBar from "./SearchBar";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import SelectType from "./SelectType";
import { useNavigate } from "react-router-dom";
import { Movie } from "../types/movieType";

interface Data {
  name: string;
  releaseDate: string;
  imdbID: string;
}

function createData(name: string, releaseDate: string, imdbID: string): Data {
  return {
    name,
    releaseDate,
    imdbID,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "releaseDate",
    numeric: false,
    disablePadding: false,
    label: "Release Date",
  },
  {
    id: "imdbID",
    numeric: false,
    disablePadding: false,
    label: "Imdb ID",
  },
];

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar() {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <div className="title">MOVIES</div>
      </Typography>
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("name");
  const [rows, setrows] = React.useState<Data[]>([]);
  const [pageNo, setpageNo] = React.useState(1);
  const [maxPageNo, setmaxPageNo] = React.useState(0);
  const selectedYear = useSelector((state: RootState) => state.filter.year);
  const searchText = useSelector((state: RootState) => state.filter.searchText);
  const selectedType = useSelector((state: RootState) => state.filter.type);
  const navigate = useNavigate();

  React.useEffect(() => {
    getMovies();
  }, [pageNo, selectedYear, searchText, selectedType]);

  const getMovies = () => {
    axios
      .get("https://www.omdbapi.com", {
        params: {
          apikey: "69b9849a",
          s: searchText,
          page: pageNo,
          y: selectedYear,
          type: selectedType,
        },
      })
      .then((response) => {
        if (response.data.Response === "False") {
          setrows([]);
          return;
        }
        setrows(() => [
          ...response?.data?.Search?.map((movie: Movie) =>
            createData(movie.Title, movie.Year, movie.imdbID)
          ),
        ]);
        setmaxPageNo(() => Math.ceil(response.data.totalResults / 10));
      });
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Avoid a layout jump when reaching the last page with empty rows.

  const visibleRows = React.useMemo(
    () => stableSort(rows, getComparator(order, orderBy)).slice(0, 10),
    [order, orderBy, rows]
  );

  const clickHandler = async (imdbID: string) => {
    navigate(`/movies/${imdbID}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar />
        <div className="filterCont">
          <SelectType />
          <SelectYear />
          <SearchBar />
        </div>
        <TableContainer>
          {!visibleRows.length ? (
            <h2 className="notFound">There is no such production...</h2>
          ) : (
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.imdbID}
                      sx={{ cursor: "pointer" }}
                      onClick={(event) => clickHandler(row.imdbID)}
                    >
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell
                        component="th"
                        id={row.imdbID}
                        scope="row"
                        padding="none"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="inherit">{row.releaseDate}</TableCell>
                      <TableCell align="inherit">{row.imdbID}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <div className="pageButtons">
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              disabled={pageNo === 1}
              onClick={() => {
                if (pageNo === 1) return;
                setpageNo((prev) => prev - 1);
              }}
            >
              <ChevronLeft />
            </Button>
            <Button
              disabled={pageNo === maxPageNo}
              onClick={() => {
                if (pageNo === maxPageNo) return;
                setpageNo((prev) => prev + 1);
              }}
            >
              <ChevronRight />
            </Button>
          </ButtonGroup>
        </div>
      </Paper>
    </Box>
  );
}
