import "./new.scss";
import styles from "./New.module.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  TextField,
  Button,
  Modal,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
  makeStyles,
  Paper,
  Grid,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import useInput from "../../hooks/useInput";
import { URL_API } from "../../helpers";
import axios from "axios";
import Spinner from "../../components/spinner/Spinner";

const productCategories = [
  "Antibiotika",
  "Antijamur",
  "Antiseptika",
  "Antihipertensi",
  "Diuretika",
  "Antidiabetes",
  "Antidiabetes",
  "Analgetik-antipiretik",
  "Antialergi",
  "Kortikosteroid",
  "Obat saluran cerna",
  "Obat saluran nafas",
  "Komedolitik",
  "Cairan Parenteral",
];

const New = ({ inputs, title }) => {
  const [loading, setLoading] = useState(false);
  const [addFile, setAddFile] = useState(null);
  const [categoryIsClicked, setCategoryIsClicked] = useState(null);
  const [unitIsClicked, setUnitIsClicked] = useState(null);
  const [inputFileIsClicked, setInputFileIsClicked] = useState(null);
  const [categoryIsFocused, setCategoryIsFocused] = useState(null);
  const [unitIsFocused, setUnitIsFocused] = useState(null);

  const [values, setValues] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    volume: "",
    unit: "",
  });

  const InputPhoto = styled("input")({
    display: "none",
  });

  ////////////////////////////
  // INPUT FIELD VALIDATION //
  ////////////////////////////

  const nameValidation = (name) => name.trim() !== "" && name.length >= 3;
  const descriptionValidation = (description) =>
    description.trim() !== "" && description.length >= 3;
  const categoryValidation = (category) => category;
  const priceValidation = (price) => price;
  const stockValidation = (stock) => stock;
  const volumeValidation = (volume) => volume;
  const unitValidation = (unit) => unit;

  ////////////////////////////
  // INPUT FIELD MANAGEMENT //
  ////////////////////////////

  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetNameInput,
    isTouched: isNameTouched,
  } = useInput(nameValidation);

  const {
    value: enteredDescription,
    isValid: enteredDescriptionIsValid,
    hasError: descriptionInputHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescriptionInput,
    isTouched: isDescriptionTouched,
  } = useInput(descriptionValidation);

  const {
    value: enteredCategory,
    valueChangeHandler: categoryChangeHandler,
    reset: resetCategoryInput,
  } = useInput(categoryValidation);

  const {
    value: enteredPrice,
    isValid: enteredPriceIsValid,
    hasError: priceInputHasError,
    valueChangeHandler: priceChangeHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPriceInput,
    isTouched: isPriceTouched,
  } = useInput(priceValidation);

  const {
    value: enteredStock,
    isValid: enteredStockIsValid,
    hasError: stockInputHasError,
    valueChangeHandler: stockChangeHandler,
    inputBlurHandler: stockBlurHandler,
    reset: resetStockInput,
    isTouched: isStockTouched,
  } = useInput(stockValidation);

  const {
    value: enteredVolume,
    isValid: enteredVolumeIsValid,
    hasError: volumeInputHasError,
    valueChangeHandler: volumeChangeHandler,
    inputBlurHandler: volumeBlurHandler,
    reset: resetVolumeInput,
    isTouched: isVolumeTouched,
  } = useInput(volumeValidation);

  const {
    value: enteredUnit,
    valueChangeHandler: unitChangeHandler,
    reset: resetUnitInput,
  } = useInput(unitValidation);

  ///////////////////
  // FORM VALIDITY //
  ///////////////////

  let formIsValid = false;

  // Custom error for Select
  // 1
  let enteredCategoryIsValid;
  let categoryInputHasError;
  if (
    categoryIsClicked == true &&
    categoryIsFocused == false &&
    enteredCategory == ""
  ) {
    enteredCategoryIsValid = false;
    categoryInputHasError = true;
  } else {
    enteredCategoryIsValid = true;
    categoryInputHasError = false;
  }
  // 2
  let enteredUnitIsValid;
  let unitInputHasError;
  if (unitIsClicked == true && unitIsFocused == false && enteredUnit == "") {
    enteredUnitIsValid = false;
    unitInputHasError = true;
  } else {
    enteredUnitIsValid = true;
    unitInputHasError = false;
  }

  if (
    enteredNameIsValid &&
    enteredDescriptionIsValid &&
    enteredCategoryIsValid &&
    enteredPriceIsValid &&
    enteredStockIsValid &&
    enteredVolumeIsValid &&
    enteredUnitIsValid
  ) {
    formIsValid = true;
  }

  // IMAGE HANDLING //
  let preview = document.getElementById("imgpreview");
  const onBtnAddFile = (e) => {
    console.log(e);
    console.log(e.target.files[0]);
    setAddFile(e.target.files);
    if (e.target.files[0]) {
      function createImageItem(i) {
        let image = document.createElement("img");
        image.src = URL.createObjectURL(e.target.files[i]);
        image.classList.add(`${styles["img-preview"]}`);

        return image;
      }

      preview.replaceChildren();
      for (var j = 0; j < e.target.files.length; j++) {
        preview.appendChild(createImageItem(j));
      }
    }
  };

  ////////////////////////
  // SUBMISSION HANDLER //
  ////////////////////////
  const submitHandler = (event) => {
    event.preventDefault();
    setCategoryIsClicked(false);

    setLoading(true);

    if (!formIsValid) {
      return;
    }

    // Buat form data, agar bisa menampung file
    let formData = new FormData();

    // Buat body nya
    let obj = {
      name: enteredName,
      description: enteredDescription,
      category: enteredCategory,
      price: enteredPrice,
      stock: enteredStock,
      volume: enteredVolume,
      unit: "tablet",
    };
    // Masukkan body nya
    formData.append("data", JSON.stringify(obj));

    // Masukkan file nya
    for (let i = 0; i < addFile.length; i++) {
      let file = addFile.item(i);
      formData.append("file", file);
    }

    // console.log(addFile);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    //buat requestnya
    console.log("masuk axios");
    axios
      .post(URL_API + "/admin/product/create", formData)
      .then((res) => {
        setLoading(false);
        setAddFile(null);
        resetNameInput();
        resetDescriptionInput();
        resetCategoryInput();
        resetPriceInput();
        resetStockInput();
        resetVolumeInput();
        preview.replaceChildren();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>

        <FormControl sx={{ minWidth: "500px" }} variant="outlined">
          <Spinner loading={loading} />
          <TextField
            error={nameInputHasError && isNameTouched ? true : false}
            // inputProps={{ style: { background: "white", fontSize: "14px" } }}
            id="name"
            label="Product Name"
            type="text"
            helperText={
              nameInputHasError && isNameTouched
                ? "Please provide product name with atleast 3 characters!"
                : ""
            }
            style={{
              marginTop: "25px",
            }}
            size="small"
            onChange={nameChangeHandler}
            onBlur={nameBlurHandler}
            value={enteredName}
          />
          <TextField
            error={
              descriptionInputHasError && isDescriptionTouched ? true : false
            }
            inputProps={{ style: { background: "white" } }}
            id="description"
            label="Product Description"
            type="text"
            helperText={
              descriptionInputHasError && isDescriptionTouched
                ? "Please provide product description with atleast 3 characters!"
                : ""
            }
            style={{
              marginTop: "25px",
            }}
            size="small"
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
            value={enteredDescription}
          />

          <Box sx={{ minWidth: 120, marginTop: "25px" }}>
            <FormControl
              fullWidth
              size="small"
              error={categoryInputHasError ? true : false}
            >
              <InputLabel id="category">Product Category</InputLabel>
              <Select
                labelId="category"
                id="category"
                label="Product Category"
                sx={{ backgroundColor: "white", textAlign: "left" }}
                onChange={categoryChangeHandler}
                onClick={() => setCategoryIsClicked(true)}
                onFocus={() => setCategoryIsFocused(true)}
                onBlur={() => setCategoryIsFocused(false)}
                value={enteredCategory}
              >
                {productCategories &&
                  productCategories.map((c, i) => {
                    return (
                      <MenuItem key={i} value={c}>
                        {c}
                      </MenuItem>
                    );
                  })}
              </Select>
              {categoryInputHasError ? (
                <FormHelperText>Please select product category!</FormHelperText>
              ) : (
                ""
              )}
            </FormControl>
          </Box>
          <TextField
            error={priceInputHasError && isPriceTouched ? true : false}
            helperText={
              priceInputHasError && isPriceTouched
                ? "Please provide product price!"
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rp</InputAdornment>
              ),
              style: { background: "white" },
              inputProps: { min: 0, step: 100 },
            }}
            id="price"
            label="Product Price"
            type="number"
            // helperText="Incorrect entry."
            style={{
              marginTop: "25px",
            }}
            size="small"
            onChange={priceChangeHandler}
            onBlur={priceBlurHandler}
            value={enteredPrice}
          />

          <Grid container spacing={1}>
            <Grid item xs={4.5}>
              <TextField
                error={stockInputHasError && isStockTouched ? true : false}
                // component={Paper}
                id="stock"
                label="Stock"
                type="number"
                helperText={
                  stockInputHasError && isStockTouched
                    ? "Please provide product stock!"
                    : "Input amount of bottles, strips, packages, etc."
                }
                style={{
                  marginTop: "25px",
                }}
                inputProps={{ style: { background: "white" } }}
                onChange={stockChangeHandler}
                onBlur={stockBlurHandler}
                value={enteredStock}
                size="small"
              />
            </Grid>
            <Grid item xs={4.5}>
              <TextField
                error={volumeInputHasError && isVolumeTouched ? true : false}
                // component={Paper}
                id="volume"
                label="Volume"
                helperText={
                  volumeInputHasError && isVolumeTouched
                    ? "Please provide product volume!"
                    : "Input quantity per bottles/strips/ packages/etc."
                }
                type="number"
                style={{
                  marginTop: "25px",
                }}
                inputProps={{ style: { background: "white" } }}
                onChange={volumeChangeHandler}
                onBlur={volumeBlurHandler}
                value={enteredVolume}
                size="small"
              />
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ marginTop: "25px" }}>
                <FormControl
                  fullWidth
                  size="small"
                  error={unitInputHasError ? true : false}
                >
                  <InputLabel id="unit">Unit</InputLabel>
                  <Select
                    labelId="unit"
                    id="unit"
                    // value={shipping}
                    label="Unit"
                    // onChange={changeHandler("shipping")}
                    sx={{ backgroundColor: "white", textAlign: "left" }}
                    onChange={unitChangeHandler}
                    onClick={() => setUnitIsClicked(true)}
                    onFocus={() => setUnitIsFocused(true)}
                    onBlur={() => setUnitIsFocused(false)}
                    value={enteredUnit}
                  >
                    <MenuItem value={0}>tablets</MenuItem>
                    <MenuItem value={1}>pills</MenuItem>
                    <MenuItem value={2}>ml</MenuItem>
                    <MenuItem value={3}>gr</MenuItem>
                  </Select>
                  {unitInputHasError ? (
                    <FormHelperText>Please select product unit!</FormHelperText>
                  ) : (
                    ""
                  )}
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <label
            htmlFor="photo"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: "25px",
            }}
          >
            <InputPhoto
              accept="image/*"
              name="photo"
              id="photo"
              type="file"
              onChange={onBtnAddFile}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
            <Button variant="outlined" size="medium" component="span">
              Select image
            </Button>
          </label>
          <div
            id="imgpreview"
            className="img-container"
            style={{ position: "relative", borderRadius: "10px" }}
          >
            Please select product image.
          </div>

          <Button
            variant="contained"
            style={{
              marginTop: "25px",
            }}
            onClick={submitHandler}
          >
            Create Product
          </Button>
        </FormControl>
      </div>
    </div>
  );
};

export default New;
