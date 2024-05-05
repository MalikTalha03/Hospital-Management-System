import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const schema = z.object({
  days: z.array(z.string()).nonempty("At least one day must be selected"),
  slots: z.array(z.string()).nonempty("At least one slot must be selected"),
});

const DoctorSlotsDialog = ({ open, onClose, doctorId }) => {
  const { control, handleSubmit, setValue, getValues } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { days: [], slots: [] },
  });
  const [allSlots, setAllSlots] = useState([]);

  useEffect(() => {
    generateTimeSlots();
  }, []);

  const generateTimeSlots = () => {
    let start = 9;
    const slotsArray = [];
    while (start < 17) {
      const time = `${start < 10 ? "0" + start : start}:00`;
      const halfPast = `${start < 10 ? "0" + start : start}:30`;
      slotsArray.push(time, halfPast);
      start++;
    }
    setAllSlots(slotsArray);
  };

  const onCheckboxChange = (name, value) => {
    const currentValues = getValues(name);
    if (currentValues.includes(value)) {
      setValue(
        name,
        currentValues.filter((v) => v !== value)
      );
    } else {
      setValue(name, [...currentValues, value]);
    }
  };

  const onSubmit = async (data) => {
    const { days, slots } = data;
    try {
      await axios.post(`/api/doctors/${doctorId}/slots`, data);
      alert("Slots updated successfully");
      onClose();
      setValue("days", []);
      setValue("slots", []);
      daysOfWeek.forEach((day) => {
        document.getElementById(
          `day-${daysOfWeek.indexOf(day)}`
        ).checked = false;
      });
      allSlots.forEach((slot) => {
        document.getElementById(
          `slot-${allSlots.indexOf(slot)}`
        ).checked = false;
      });
    } catch (error) {
      alert("Failed to update slots: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Doctor Slots</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 p-4">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="days"
                  render={({ field }) => (
                    <Checkbox
                      id={`day-${index}`}
                      checked={field.value.includes(day)}
                      onCheckedChange={() => onCheckboxChange("days", day)}
                    />
                  )}
                />
                <label htmlFor={`day-${index}`}>{day}</label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 p-4">
            {allSlots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Controller
                  control={control}
                  name="slots"
                  render={({ field }) => (
                    <Checkbox
                      id={`slot-${index}`}
                      checked={field.value.includes(slot)}
                      onCheckedChange={() => onCheckboxChange("slots", slot)}
                    />
                  )}
                />
                <label htmlFor={`slot-${index}`}>{slot}</label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Save Slots</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorSlotsDialog;
