"use client";
import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import { MdClose, MdInfo, MdSave } from "react-icons/md";
import { FaEdit, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Popup type options as specified
const POPUP_TYPES = [
  { value: "Home Page", label: "Home Page" },
  { value: "Category", label: "Category" },
  { value: "Brand", label: "Brand" },
  { value: "Vendor", label: "Vendor" },
  { value: "Customer", label: "Customer" },
  { value: "Wallet", label: "Wallet" },
  { value: "Login", label: "Login" },
];

interface Popup {
  id: number;
  title: string;
  content: string;
  image: File | null;
  button_text: string;
  button_url: string;
  status: boolean;
  type: string;
}

const PopupManager: NextPage = () => {
  const api = useAxios();
  const [popups, setPopups] = useState<Popup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPopup, setCurrentPopup] = useState<Popup | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null as File | null,
    button_text: "",
    button_url: "",
    status: true,
    type: "Home Page", // Default popup type
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      image: null,
      button_text: "",
      button_url: "",
      status: true,
      type: "Home Page",
    });
    setImagePreview(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview URL for the selected image
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked ? 1 : 0,
    });
  };

  const loadPopups = async () => {
    try {
      const response = await api.get("/admin/getPopups/");
      if (response.status === 200) {
        setPopups(response.data);
        toast.success("Popups loaded successfully");
      } else {
        toast.error("Failed to load popups");
      }
    } catch (error) {
      toast.error("Error loading popups");
      console.error(error);
    }
  };

  useEffect(() => {
    loadPopups();
  }, []);

  const handleEdit = (popup: Popup) => {
    setCurrentPopup(popup);
    setFormData({
      title: popup.title,
      content: popup.content,
      image: null, // Reset file input on edit
      button_text: popup.button_text,
      button_url: popup.button_url,
      status: popup.status,
      type: popup.type || "Home Page",
    });
    setIsEditing(true);
  };

  const handleCreate = async () => {
    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("button_text", formData.button_text);
      formDataToSend.append("button_url", formData.button_url);
      formDataToSend.append("status", formData.status.toString());
      formDataToSend.append("type", formData.type);

      // Append image if available
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await api.post("/admin/createPopUp/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Popup created successfully");
        resetForm();
        setIsCreating(false);
        loadPopups();
      } else {
        toast.error("Failed to create popup");
      }
    } catch (error) {
      toast.error("Error creating popup");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!currentPopup) return;

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("button_text", formData.button_text);
      formDataToSend.append("button_url", formData.button_url);
      formDataToSend.append("status", formData.status.toString());
      formDataToSend.append("type", formData.type);

      // Append image if available
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await api.put(
        `/admin/updatePopUp/${currentPopup.id}/`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Popup updated successfully");
        setIsEditing(false);
        loadPopups();
      } else {
        toast.error("Failed to update popup");
      }
    } catch (error) {
      toast.error("Error updating popup");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/admin/deletePopUp/${id}/`);

      if (response.status === 204) {
        toast.success("Popup deleted successfully");
        loadPopups();
      } else {
        toast.error("Failed to delete popup");
      }
    } catch (error) {
      toast.error("Error deleting popup");
      console.error(error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await api.put(`/admin/updatePopUp/${id}/`, {
        status: currentStatus ? false : true,
      });

      if (response.status === 200) {
        toast.success("Status updated successfully");
        loadPopups();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating status");
      console.error(error);
    }
  };

  const handlePreview = (popup: Popup) => {
    // Implementation for preview functionality
    toast.info("Preview functionality would open the popup in a modal");
  };

  return (
    <div className="mx-auto p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Popup Notifications</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button variant="default">Create New Popup</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Popup Notification</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new popup notification for your
                users.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-right">
                  Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Popup Type
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select popup type" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPUP_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="col-span-3"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-24 rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button_text" className="text-right">
                  Button Text
                </Label>
                <Input
                  id="button_text"
                  name="button_text"
                  value={formData.button_text}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="button_url" className="text-right">
                  Button URL
                </Label>
                <Input
                  id="button_url"
                  name="button_url"
                  value={formData.button_url}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) =>
                      handleSwitchChange("status", checked)
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Popup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Popup Notification</DialogTitle>
            <DialogDescription>
              Update the details of your popup notification.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">
                Content
              </Label>
              <Textarea
                id="edit-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Popup Type
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select popup type" />
                  </SelectTrigger>
                  <SelectContent>
                    {POPUP_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="col-span-3"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-24 rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.image ? "New image selected" : "Current image"}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-button_text" className="text-right">
                Button Text
              </Label>
              <Input
                id="edit-button_text"
                name="button_text"
                value={formData.button_text}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-button_url" className="text-right">
                Button URL
              </Label>
              <Input
                id="edit-button_url"
                name="button_url"
                value={formData.button_url}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Active
              </Label>
              <div className="col-span-3">
                <Switch
                  id="edit-status"
                  checked={formData.status}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("status", checked)
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Popup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r">ID</th>
            <th className="py-2 px-4 border-b border-r">Title</th>
            <th className="py-2 px-4 border-b border-r">Type</th>
            <th className="py-2 px-4 border-b border-r">Status</th>
            <th className="py-2 px-4 border-b border-r">Actions</th>
          </tr>
        </thead>
        <tbody>
          {popups.map((popup) => (
            <tr key={popup.id}>
              <td className="py-2 px-4 border-b border-r text-center">
                {popup.id}
              </td>
              <td className="py-2 px-4 border-b border-r">{popup.title}</td>
              <td className="py-2 px-4 border-b border-r">
                {popup.type || "Home Page"}
              </td>

              <td className="py-2 px-4 border-b border-r text-center">
                <Switch
                  checked={popup.status}
                  onClick={() => handleToggleStatus(popup.id, popup.status)}
                />
              </td>
              <td className="py-2 px-4 border-b flex justify-evenly">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(popup)}
                  title="Edit"
                >
                  <FaEdit className="text-blue-500" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePreview(popup)}
                  title="Preview"
                >
                  <MdInfo className="text-green-500" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Delete">
                      <MdClose className="text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the popup notification and remove it from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 text-white"
                        onClick={() => handleDelete(popup.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PopupManager;
