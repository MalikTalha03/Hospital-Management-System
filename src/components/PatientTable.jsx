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
import { EditIcon, DeleteIcon, File } from "lucide-react";
import AddPatientDialog from "@/components/AddpatientDialog";
import EditPatientDialog from "./EditPatientDialog";

export default function PatientsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pid, setPid] = useState("");
  const deletePatient = (id) => async () => {
    console.log("delete", id);
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      const response = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Patient deleted successfully");
      }
      else {
        alert("Failed to delete the patient ", error);
      }
      fetchPatients();
    }
  };
  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients");
      const data = await response.json();
      if (response.ok) {
        setPatients(data);
      }
      if (response.status == 404) {
        setPatients([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchPatients();
  }, []);
  useEffect(() => {
    fetchPatients();
  }, [dialogOpen, editOpen]);
  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
        <Button
          variant="outline"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-auto"
          onClick={() => setDialogOpen(true)}
        >
          Add Patient
        </Button>
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
            {patients && patients.length > 0 ? (
              patients.map((patient) => (
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
                      onClick={() => {
                        setPid(patient.id);
                        setEditOpen(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={deletePatient(patient.id)}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button 
                      variant="icon"
                      className="text-green-500 hover:text-green-700"
                      onClick={() => {
                        window.location.href = `/patients/${patient.id}`;
                      }}
                    >
                      <File />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="8" style={{ textAlign: "center" }}>
                  No patients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <AddPatientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      <EditPatientDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        patientId={pid}
      />
    </Card>
  );
}
