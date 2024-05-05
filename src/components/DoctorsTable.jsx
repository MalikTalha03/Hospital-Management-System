import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon, DeleteIcon, CalendarCheck2 } from "lucide-react";
import AddDoctor from "@/components/AddDoctor";
import EditDoctor from "@/components/EditDoctor";
import DoctorSlotsDialog from "./AddSchedule";

export default function DoctorsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [docId, setDocId] = useState("");
  const [docSlot, setDocSlot] = useState(false);

  const deleteDoctor = (id) => async () => {
    console.log("delete", id);
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      const response = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Doctor deleted successfully");
      } else {
        alert("Failed to delete the doctor");
      }
      fetchDoctors();
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch("/api/doctors");
      const data = await response.json();
      if (response.ok) {
        setDoctors(data);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  useEffect(() => {
    fetchDoctors();
  }, [dialogOpen, editOpen]);

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Doctor Details</CardTitle>
        <Button
          variant="outline"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-auto"
          onClick={() => setDialogOpen(true)}
        >
          Add Doctor
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Years of Experience</TableCell>
              <TableCell>Consultation Fee</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors && doctors.length > 0 ? (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.experience} years</TableCell>
                  <TableCell>${doctor.fee}</TableCell>
                  <TableCell>{doctor.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="icon"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setDocId(doctor.id);
                        setEditOpen(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={deleteDoctor(doctor.id)}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button
                      variant="icon"
                      className="text-green-500 hover:text-green-700"
                      onClick={() => {
                        setDocSlot(true);
                        setDocId(doctor.id);
                      }}
                    >
                      <CalendarCheck2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" style={{ textAlign: "center" }}>
                  No doctors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <AddDoctor open={dialogOpen} onClose={() => setDialogOpen(false)} />
      <EditDoctor
        open={editOpen}
        onClose={() => setEditOpen(false)}
        doctorId={docId}
      />
      <DoctorSlotsDialog
        open={docSlot}
        onClose={() => setDocSlot(false)}
        doctorId={docId}
      />
    </Card>
  );
}
