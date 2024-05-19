import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { setYear } from "../redux/moviesSlice";
import { useDispatch } from "react-redux";

export default function SelectYear() {
  const [selectedYear, setSelectedYear] = React.useState("");
  const [years, setyears] = React.useState<number[]>([]);

  const dispatch = useDispatch();

  React.useEffect(() => {
    let array: number[] = [];
    for (let i = 1800; i <= new Date().getFullYear(); i++) {
      array.unshift(i);
    }
    setyears(() => array);
  }, []);

  React.useEffect(() => {
    if (selectedYear === "All") {
      dispatch(setYear(null));
      return;
    }
    dispatch(setYear(selectedYear));
  }, [selectedYear]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedYear(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Year</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedYear}
          label="Year"
          onChange={handleChange}
          defaultValue="All"
        >
          <MenuItem key={"randomUniqueKey"} value={"All"}>
            All
          </MenuItem>
          {years.map((year) => {
            return (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
