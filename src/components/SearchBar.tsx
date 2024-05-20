import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchText } from "../redux/filterSlice";

export default function SearchBar() {
  const [searchValue, setsearchValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (searchValue.trim() === "" || searchValue.length < 3) {
      dispatch(setSearchText("Pokemon"));
      return;
    }
    dispatch(setSearchText(searchValue));
  }, [searchValue]);

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        id="standard-search"
        label="Search a Movie"
        type="search"
        variant="outlined"
        value={searchValue}
        onChange={(e) => setsearchValue(e.target.value)}
      />
    </Box>
  );
}
