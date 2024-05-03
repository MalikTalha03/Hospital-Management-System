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
import { EditIcon, DeleteIcon } from "lucide-react";
import AddPatientDialog from "@/components/AddpatientDialog";
import EditPatientDialog from "./EditPatientDialog";

export default function PatientsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pid, setPid] = useState("");
  const deletePatient = (id) => async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });
      fetchPatients();
    }
  };
  const fetchPatients = async () => {
    const response = await fetch("/api/patients");
    const data = await response.json();
    setPatients(data);
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
            {patients &&
              patients.map((patient) => (
                <TableRow key={patient._id}>
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
                        setPid(patient._id);
                        setEditOpen(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={deletePatient(patient._id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
