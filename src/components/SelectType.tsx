import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { setType } from "../redux/filterSlice";
import { useDispatch } from "react-redux";

export default function SelectType() {
  const [selectedType, setSelectedType] = React.useState("");

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (selectedType === "All") {
      dispatch(setType(null));
      return;
    }
    dispatch(setType(selectedType));
  }, [selectedType]);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedType(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedType}
          label="Type"
          onChange={handleChange}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="movie">Movies</MenuItem>
          <MenuItem value="series">TV Series</MenuItem>
          <MenuItem value="episode">TV Series Episodes</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
