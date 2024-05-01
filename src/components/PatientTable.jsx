import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditIcon, DeleteIcon } from "lucide-react";
import AddPatientDialog from '@/components/AddpatientDialog';


export default function PatientsTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const fetchPatients = async () => {
    const response = await fetch('/api/patients');
    const data = await response.json();
    setPatients(data);
  }
  useEffect(() => {
    fetchPatients();
  } , []);

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
              <TableRow key={patient.id}>
                <TableCell>
                  <img src={patient.image} alt={patient.name} className="w-10 h-10 rounded-full" />
                </TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  <Button variant="icon" className="text-blue-500 hover:text-blue-700">
                    <EditIcon />
                  </Button>
                  <Button variant="icon" className="text-red-500 hover:text-red-700">
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AddPatientDialog open={dialogOpen}  onClose={() => setDialogOpen(false)} />
    </Card>
  );
}
