import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import * as yup from "yup";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { set } from "mongoose";
import Loader from "./Loader";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be positive")
    .integer("Age must be an integer"),
  gender: yup.string().required("Gender is required"),
  bloodGroup: yup.string().required("Blood group is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be numeric"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
});

const EditPatientDialog = ({ open, patientId, onClose }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId || patientId == null) {
        return;
      }
      const response = await axios.get(`/api/patients/${patientId}`);
      setPatient(response.data);
      setLoading(false);
    };
    fetchPatient();
  }, [patientId]);

  const formik = useFormik({
    initialValues: {
      name: patient?.name || "",
      age: patient?.age || "",
      gender: patient?.gender || "",
      bloodGroup: patient?.bloodGroup || "",
      phone: patient?.phone || "",
      email: patient?.email || "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.patch(`/api/patients/${patientId}`, values);
        onClose();
        alert("Patient updated successfully");
      } catch (error) {
        console.error("Failed to update patient:", error);
        alert("An error occurred. Please try again.");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
            <DialogDescription>
              Update the details below to edit the patient.
            </DialogDescription>
          </DialogHeader>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.name}
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.age}
                />
                {formik.touched.age && formik.errors.age ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.age}
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="gender">Gender</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {formik.values.gender || "Select Gender"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup
                      value={formik.values.gender}
                      onValueChange={(value) =>
                        formik.setFieldValue("gender", value)
                      }
                    >
                      <DropdownMenuRadioItem value="Male">
                        Male
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Female">
                        Female
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Other">
                        Other
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {formik.touched.gender && formik.errors.gender ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.gender}
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      {formik.values.bloodGroup || "Select Blood Group"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup
                      value={formik.values.bloodGroup}
                      onValueChange={(value) =>
                        formik.setFieldValue("bloodGroup", value)
                      }
                    >
                      <DropdownMenuRadioItem value="A+">
                        A+
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="A-">
                        A-
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="B+">
                        B+
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="B-">
                        B-
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="O+">
                        O+
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="O-">
                        O-
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="AB+">
                        AB+
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="AB-">
                        AB-
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {formik.touched.bloodGroup && formik.errors.bloodGroup ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.bloodGroup}
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.phone}
                  </div>
                ) : null}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-xs">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Update Patient</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientDialog;
