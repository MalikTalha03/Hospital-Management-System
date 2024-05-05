import { Button } from "@/components/ui/button";
import { useFormik } from "formik";
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
import axios from "axios";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  specialization: yup.string().required("Specialization is required"),
  experience: yup
    .number()
    .required("Years of experience is required")
    .positive("Experience must be positive")
    .integer("Experience must be an integer"),
  fee: yup
    .number()
    .required("Consultation fee is required")
    .positive("Fee must be positive"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must be numeric"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email"),
});

const AddDoctorDialog = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      specialization: "",
      experience: "",
      fee: "",
      phone: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("/api/doctors/add", values);
        alert("Doctor added successfully");
        resetForm();
        onClose();
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Doctor</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new doctor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <Label htmlFor="specialization">Specialization</Label>
            <Input
              id="specialization"
              name="specialization"
              onChange={formik.handleChange}
              value={formik.values.specialization}
            />
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              name="experience"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.experience}
            />
            <Label htmlFor="fee">Consultation Fee</Label>
            <Input
              id="fee"
              name="fee"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.fee}
            />
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Adding..." : "Add Doctor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;
