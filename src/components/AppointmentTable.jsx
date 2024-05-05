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
import { EditIcon, DeleteIcon, Calendar } from "lucide-react";
import Loader from "@/components/Loader";
import AddAppointmentDialog from "@/components/AddAppointment";
import { Input } from "@/components/ui/input";

const AppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    const filtered = appointments.filter(
      (appointment) =>
        appointment.patientName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAppointments(filtered);
  }, [searchTerm, appointments]);
  useEffect(() => {
    fetchAppointments();
  }, []);
  useEffect(() => {
    fetchAppointments();
  }, [dialogOpen]);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const response = await fetch("/api/appointments");
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const appointments = await response.json();

      const detailedAppointmentsPromises = appointments.map(
        async (appointment) => {
          const [patientResponse, doctorResponse] = await Promise.all([
            fetch(`/api/patients/${appointment.patientId}`),
            fetch(`/api/doctors/${appointment.doctorId}`),
          ]);

          if (!patientResponse.ok || !doctorResponse.ok) {
            throw new Error("Failed to fetch patient or doctor details");
          }

          const patientData = await patientResponse.json();
          const doctorData = await doctorResponse.json();

          return {
            ...appointment,
            patientName: patientData.name,
            doctorName: doctorData.name,
          };
        }
      );

      const detailedAppointments = await Promise.all(
        detailedAppointmentsPromises
      );
      detailedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
      detailedAppointments.sort((a, b) => a.time.localeCompare(b.time));
      setAppointments(detailedAppointments);
      setFilteredAppointments(detailedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
      setFilteredAppointments([]);
    }
    setLoading(false);
  }

  const deleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Appointment deleted successfully.");
        fetchAppointments();
      } else {
        alert("Failed to delete the appointment.");
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>Appointment Details</CardTitle>
        <Input
          placeholder="Search by doctor or patient name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm"
          style={{
            width: "250px",
            marginTop: "20px",
            border: "5px solid #e2e8f0",
          }}
        />
        <Button
          variant="primary"
          onClick={() => setDialogOpen(true)}
          className="flex items-center bg-blue-500 hover:bg-blue-700 ml-auto text-white font-bold py-2 px-4"
        >
          <Calendar size={16} />
          <span className="ml-2">Add Appointment</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {new Date(appointment.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell>
                    {new Date(appointment.date) > new Date() ? (
                      <Button
                        variant="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <DeleteIcon />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" style={{ textAlign: "center" }}>
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <AddAppointmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Card>
  );
};

export default AppointmentsTable;
