"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon, DeleteIcon } from "lucide-react";
import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
// Assuming this is your Patient data, replace with actual API call data.
const patientData = [
  {
    id: 1,
    name: "John Doe",
    age: 25,
    gender: "Male",
    bloodGroup: "A+",
    phone: "1234567890",
    email: "jd@email.com",
    image:
      "https://img.freepik.com/free-vector/cool-beard-man-barber-head-with-glasses-cartoon-vector-icon-illustration-people-barber-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3960.jpg?w=740&t=st=1713629381~exp=1713629981~hmac=2bc282704d699e4f254691507b27841f9f25160186e0d31906d39e87334b41ea",
  },
  {
    id: 2,
    name: "Jane Doe",
    age: 30,
    gender: "Female",
    bloodGroup: "B+",
    phone: "1234567890",
    email: "jdf@email.com",
    image:
      "https://img.freepik.com/free-vector/cool-beard-man-barber-head-with-glasses-cartoon-vector-icon-illustration-people-barber-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3960.jpg?w=740&t=st=1713629381~exp=1713629981~hmac=2bc282704d699e4f254691507b27841f9f25160186e0d31906d39e87334b41ea",
  },
];

export default function PatientsTable() {
  const [position, setPosition] = useState("male");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      age: "",
      gender: "",
      bloodGroup: "",
      phone: "",
      email: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock API delay
        // Assuming success response
        setNotification({
          show: true,
          message: "Patient added successfully!",
          type: "success",
        });
        resetForm();
        onClose(); // Close the sheet if you want after submission
      } catch (error) {
        setNotification({
          show: true,
          message: "Failed to add patient. Try again!",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-auto"
            >
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={formik.handleSubmit}>
              <DialogHeader>
                <DialogTitle>Add Patient</DialogTitle>
                <DialogDescription>
                    Fill in the details below to add a new patient.
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
                {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-xs">{formik.errors.name}</div>
                    ) : null}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    onChange={formik.handleChange}
                    value={formik.values.age}
                  />
                    {formik.touched.age && formik.errors.age ? (
                    <div className="text-red-500 text-xs">{formik.errors.age}</div>
                    ) : null}
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
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
                    <div className="text-red-500 text-xs">{formik.errors.gender}</div>
                  ) : null}
                </div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  name="bloodGroup"
                  onChange={formik.handleChange}
                  value={formik.values.bloodGroup}
                />
                {formik.touched.bloodGroup && formik.errors.bloodGroup ? (
                    <div className="text-red-500 text-xs">{formik.errors.bloodGroup}</div>
                    ) : null}
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500 text-xs">{formik.errors.phone}</div>
                    ) : null}
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-xs">{formik.errors.email}</div>
                    ) : null}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Patient"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patientData.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <img
                    src={patient.image}
                    alt={patient.name}
                    className="w-10 h-10 rounded-full"
                  />
                </TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  <Button
                    variant="icon"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    variant="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
