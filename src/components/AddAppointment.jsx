import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/Combobox";
import { Select } from "@/components/ui/select";

const validationSchema = yup.object({
  patientId: yup.string().required("Patient is required"),
  doctorId: yup.string().required("Doctor is required"),
  date: yup.date().required("Date is required"),
  timeSlot: yup.string().required("Time slot is required"),
});

const AddAppointmentDialog = ({ open, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const formik = useFormik({
    initialValues: {
      patientId: "",
      doctorId: "",
      date: "",
      timeSlot: "",
    },
    validationSchema,
    onSubmit: (values) => {
      axios
        .post("/api/appointments", {
          patientId: values.patientId,
          doctorId: values.doctorId,
          date: values.date,
          time: values.timeSlot,
        })
        .then(() => {
          alert("Appointment added successfully");
          onClose();
        })
        .catch((error) => {
          alert("Failed to add appointment: " + error.message);
        });
    },
  });

  useEffect(() => {
    axios
      .get("/api/doctors")
      .then((response) =>
        setDoctors(response.data.map((d) => ({ label: d.name, value: d.id })))
      );
    axios
      .get("/api/patients")
      .then((response) =>
        setPatients(response.data.map((p) => ({ label: p.name, value: p.id })))
      );
  }, []);

  useEffect(() => {
    if (formik.values.doctorId && formik.values.date) {
      const dayOfWeek = new Date(formik.values.date).getDay();
      axios
        .get(`/api/appointments/availability`, {
          params: {
            doctorId: formik.values.doctorId,
            date: formik.values.date,
          },
        })
        .then((response) =>
          setTimeSlots(
            response.data.map((slot) => ({
              label: slot.slot,
              value: slot.slot,
            }))
          )
        )
        .catch(() => setTimeSlots([]));
    }
  }, [formik.values.doctorId, formik.values.date]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-5">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Appointment</DialogTitle>
            <DialogDescription>
              Enter the details to schedule a new appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="patientId">Patient</Label>
            <Combobox
              items={patients}
              onChange={(value) => formik.setFieldValue("patientId", value)}
              placeholder="Select a patient"
            />
            <Label htmlFor="doctorId">Doctor</Label>
            <Combobox
              items={doctors}
              onChange={(value) => formik.setFieldValue("doctorId", value)}
              placeholder="Select a doctor"
            />
            {formik.values.patientId && formik.values.doctorId && (
              <>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  onChange={formik.handleChange}
                  value={formik.values.date}
                />
                {formik.values.date && (
                  <>
                    <Label htmlFor="timeSlot">Time Slot</Label>
                    <Combobox
                      items={timeSlots}
                      onChange={(value) =>
                        formik.setFieldValue("timeSlot", value)
                      }
                      placeholder="Select a time slot"
                    />
                  </>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Add Appointment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
