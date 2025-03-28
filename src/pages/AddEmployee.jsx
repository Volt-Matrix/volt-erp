import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
  Typography,
} from "@mui/material";

import SubModuleOption from "../components/SubModuleButton";
import SubModuleBar from "../components/SubModuleBar";

const optionsStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  border: "1px solid #a98467",
  borderRadius: "7px",
  backgroundColor: "#C4A389",//"#a98467"
}

const moduleBarData = [
  {url: "/labour-management", text: "Overview"},
  {url: "/add-employee", text: "Add Employee"},
]

const AddEmployee = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
 
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Form submitted successfully!");
  };
 
  return (
    <div>

      <SubModuleBar moduleData={moduleBarData}/>

    <Container maxWidth="md" sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
      <Typography variant="h5" gutterBottom align="center" sx={{fontWeight: "bold"}}>
        Add Employee Details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" {...register("fullName", { required: "Full Name is required" })} error={!!errors.fullName} helperText={errors.fullName?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} {...register("dob", { required: "Date of Birth is required" })} error={!!errors.dob} helperText={errors.dob?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Phone Number" type="tel" {...register("phoneNumber", { required: "Phone Number is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" } })} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Age" {...register("age", { required: "Age is required", min: 18 })} error={!!errors.age} helperText={errors.age?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Date of Joining" type="date" InputLabelProps={{ shrink: true }} {...register("dateOfJoining", { required: "Date of Joining is required" })} error={!!errors.dateOfJoining} helperText={errors.dateOfJoining?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Controller name="gender" control={control} rules={{ required: "Gender is required" }} render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              )} />
            </FormControl>
          </Grid>
        </Grid>
 
        <Typography variant="h6" gutterBottom mt={3}>
          Employment Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.jobRole}>
              <InputLabel>Job Role/Designation</InputLabel>
              <Controller name="jobRole" control={control} rules={{ required: "Job Role is required" }} render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="Engineer">Engineer</MenuItem>
                  <MenuItem value="Technician">Technician</MenuItem>
                  <MenuItem value="Supervisor">Supervisor</MenuItem>
                  <MenuItem value="Laborer">Laborer</MenuItem>
                </Select>
              )} />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Controller name="department" control={control} rules={{ required: "Department is required" }} render={({ field }) => (
                <Select {...field}>
                  <MenuItem value="Construction">Construction</MenuItem>
                  <MenuItem value="Painting">Painting</MenuItem>
                  <MenuItem value="Cleaning">Cleaning</MenuItem>
                  <MenuItem value="Domestic Work">Domestic Work</MenuItem>
                </Select>
              )} />
            </FormControl>
          </Grid>
        </Grid>
 
        <Typography variant="h6" gutterBottom mt={3}>
          Work & Leave Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Total Working Hours per Day" {...register("workingHours", { required: "This field is required" })} error={!!errors.workingHours} helperText={errors.workingHours?.message} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Leave Balance" {...register("leaveBalance", { required: "Leave Balance is required" })} error={!!errors.leaveBalance} helperText={errors.leaveBalance?.message} />
          </Grid>
        </Grid>
 
        <Grid item xs={12} textAlign="center" mt={3}>
          <Button type="submit" variant="contained" color="primary" sx={{ px: 5, bgcolor:"#CFE1F0" }}>
          <p style={{fontWeight:"bold", color:"black", margin: "0"}}>Submit</p>
          </Button>
        </Grid>
      </form>
    </Container>

    </div>
  );
};
 
export default AddEmployee;