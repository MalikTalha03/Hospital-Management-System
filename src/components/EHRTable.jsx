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
import { EditIcon, DeleteIcon, FileSpreadsheet } from "lucide-react";
import AddEHRDialog from "@/components/AddEHRDialog";
import Loader from "./Loader";

export default function EHRTable({ patientId }) {
  const [ehrRecords, setEhrRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchEHRData();
  }, [patientId]);

  async function fetchEHRData() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/ehr`);
      const data = await response.json();
      console.log("response ", response);
      if (response.ok) {
        setEhrRecords(data);
      } else if (response.status == 404) {
        setEhrRecords([]);
      } else {
        console.error("Failed to fetch EHR data:", data);
        alert("Failed to fetch data: " + data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: " + error.message);
    }
    setIsLoading(false);
  }
  useEffect(() => {
    console.log("Updated EHR data:", ehrRecords);
  }, [ehrRecords]);

  const deleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const response = await fetch(`/api/patients/${patientId}/ehr/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Record deleted successfully.");
          fetchEHRData();
        } else {
          alert("Failed to delete the record.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Error deleting record: " + error.message);
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <Card className="min-w-full">
      <CardHeader>
        <CardTitle>EHR Records for Patient ID: {patientId}</CardTitle>
        <Button className="ml-auto" onClick={() => setDialogOpen(true)}>
          Add EHR Record
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date of Record</TableCell>
              <TableCell>Report Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ehrRecords.length > 0 ? (
              ehrRecords.map((record, index) => (
                <TableRow key={record.eid}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {new Date(
                      record.createdAt._seconds * 1000
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{record.reportName}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteRecord(record.eid)}
                    >
                      <DeleteIcon size={20} />
                    </Button>
                    <Button
                      variant="icon"
                      className="text-green-500 hover:text-green-700"
                      onClick={() => window.open(record.fileUrl, "_blank")}
                    >
                      <FileSpreadsheet size={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: "center" }}>
                  No EHR records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <AddEHRDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        patientId={patientId}
      />
    </Card>
  );
}
