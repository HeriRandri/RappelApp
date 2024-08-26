import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Category = () => {
  const navigate = useNavigate();
  const categories = ["Add", "notice of cancellation", "policy cancelled"];

  const [category, setCategory] = useState(categories[0]); // Default to first category
  const handlClick = () => {
    navigate("/add");
  };

  return (
    <div>
      <Stack spacing={3} maxWidth="600px" width="100%" mx="auto">
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel className="my-10 mx-5">Portal</InputLabel>
            <Select
              className="my-10 mx-5"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onClick={handlClick}
              label="Catégorie"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </div>
  );
};

export default Category;
