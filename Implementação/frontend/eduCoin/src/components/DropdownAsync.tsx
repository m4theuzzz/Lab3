// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** MUI Imports
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

// ** Third Party Imports
import axios from "axios";

interface FilmType {
  year: number;
  title: string;
}

const DropdownAsync = ({
  value,
  endpoint,
  valueKey,
  valueTag,
  ...props
}: any) => {
  // ** States
  console.log(props)
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<FilmType[]>([]);

  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    const fetchData = async () => {
      const response = await axios.get("http://localhost:3000" + endpoint, {
        headers: {
          "session-token": window.localStorage.getItem("apiKey"),
        },
      });

      const data = await response.data;

      setOptions(data);
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [loading]);

  return (
    <Autocomplete
      {...props}
      open={open}
      options={options}
      loading={loading}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={
        open
          ? null
          : options.find((option: any) => option[valueTag] == valueKey) || null
      }
      id="autocomplete-asynchronous-request"
      getOptionLabel={(option) => option.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default DropdownAsync;
