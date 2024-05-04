import { useFormik } from "formik";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import axios from "axios";
import * as yup from "yup";

const validationSchema = yup.object({
  reportName: yup.string().required("Report name is required"),
  description: yup.string().required("Description is required"),
  file: yup.mixed().required("File is required"),
});

const AddEHRDialog = ({ open, onClose, patientId }) => {
  const formik = useFormik({
    initialValues: {
      reportName: "",
      description: "",
      file: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const formData = new FormData();
      formData.append("reportName", values.reportName);
      formData.append("description", values.description);
      formData.append("file", values.file);
      console.log(values);
      try {
        await axios.post(`/api/patients/${patientId}/ehr`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          method: "POST",
        });
        alert("EHR added successfully");
        resetForm();
        onClose();
      } catch (error) {
        alert("An error occurred. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("file", file);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={formik.handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add EHR Record</DialogTitle>
            <DialogDescription>
              Fill in the details and upload a file to add a new EHR record.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="reportName">Report Name</Label>
            <Input
              id="reportName"
              name="reportName"
              onChange={formik.handleChange}
              value={formik.values.reportName}
            />
            {formik.touched.reportName && formik.errors.reportName && (
              <div className="text-red-500 text-xs">
                {formik.errors.reportName}
              </div>
            )}

            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs">
                {formik.errors.description}
              </div>
            )}

            <Label htmlFor="file">File Upload</Label>
            <Input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
            />
            {formik.touched.file && formik.errors.file && (
              <div className="text-red-500 text-xs">{formik.errors.file}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? "Uploading..." : "Upload EHR"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEHRDialog;
