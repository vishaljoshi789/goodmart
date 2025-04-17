"use client";
import { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Edit,
  Trash2,
  Plus,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { GMContext } from "@/app/(utils)/context/GMContext";

// Define the type for advertisements
interface Advertisement {
  id: string;
  page: AdvertisementType;
  image: string;
  link: string;
  added_on: string;
  modify_on: string;
}

type AdvertisementType = "Home Page" | "Category" | "User" | "Wallet" | "Login";

// Advertisement type options based on your model choices
const ADVERTISEMENT_TYPES: AdvertisementType[] = [
  "Home Page",
  "Category",
  "User",
  "Wallet",
  "Login",
];

export default function AdvertisementAdmin() {
  // State
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] =
    useState<Advertisement | null>(null);

  // New advertisement form state
  const [newAdPage, setNewAdPage] = useState<AdvertisementType>("Home Page");
  const [newAdLink, setNewAdLink] = useState("");
  const [newAdImage, setNewAdImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const api = useAxios();

  const { baseURL } = useContext(GMContext);

  // Fetch advertisements
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/getAdvertisements/");
      if (response.status === 200) {
        setAdvertisements(response.data);
      } else {
        setError("Failed to fetch advertisements");
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch advertisements. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewAdImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create advertisement
  const handleCreateAdvertisement = async () => {
    // Validation
    if (!newAdImage || !newAdLink) {
      setError("Please provide all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("page", newAdPage);
      formData.append("link", newAdLink);
      formData.append("image", newAdImage);

      const response = await api.post("/admin/createAdvertisement/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status !== 201) {
        setError("Failed to create advertisement");
        return;
      } else if (response.status === 201) {
        setAdvertisements([...advertisements, response.data]);
      }
      resetForm();
      setIsCreateDialogOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to create advertisement. Please try again.");
      console.error(err);
    }
  };

  // Update advertisement
  const handleUpdateAdvertisement = async () => {
    if (!selectedAdvertisement) return;

    try {
      // In a real application, this would be an API call
      // For demonstration, updating local state
      console.log(newAdImage);
      const formData = new FormData();
      formData.append("page", newAdPage);
      formData.append("link", newAdLink);
      if (newAdImage) {
        formData.append("image", newAdImage);
      }
      const response = await api.put(
        `/admin/updateAdvertisement/${selectedAdvertisement.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchAdvertisements();
      resetForm();
      setIsEditDialogOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to update advertisement. Please try again.");
      console.error(err);
    }
  };

  // Delete advertisement
  const handleDeleteAdvertisement = async () => {
    if (!selectedAdvertisement) return;

    try {
      // In a real application, this would be an API call
      // For demonstration, removing from local state
      const response = await api.delete(
        `/admin/deleteAdvertisement/${selectedAdvertisement.id}/`
      );
      fetchAdvertisements();
      setIsDeleteDialogOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to delete advertisement. Please try again.");
      console.error(err);
    }
  };

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Reset form
  const resetForm = () => {
    setNewAdPage("Home Page");
    setNewAdLink("");
    setNewAdImage(null);
    setImagePreview(null);
    setSelectedAdvertisement(null);
  };

  // Open edit dialog
  const openEditDialog = (advertisement: Advertisement) => {
    setSelectedAdvertisement(advertisement);
    setNewAdPage(advertisement.page);
    setNewAdLink(advertisement.link);
    setImagePreview(advertisement.image);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Advertisement Management
              </CardTitle>
              <CardDescription>
                Create, update, and manage advertisements for your website
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Advertisement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableCaption>A list of your advertisements</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No advertisements found. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={baseURL + ad.image}
                            alt={`Advertisement for ${ad.page}`}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{ad.page}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {ad.link}
                      </TableCell>
                      <TableCell>{formatDate(ad.added_on)}</TableCell>
                      <TableCell>{formatDate(ad.modify_on)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(ad)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedAdvertisement(ad);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Advertisement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Advertisement</DialogTitle>
            <DialogDescription>
              Add a new advertisement to display on your website.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page">Advertisement Page</Label>
              <Select
                value={newAdPage}
                onValueChange={(value) =>
                  setNewAdPage(value as AdvertisementType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {ADVERTISEMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Advertisement Link</Label>
              <Input
                id="link"
                placeholder="https://example.com/promotion"
                value={newAdLink}
                onChange={(e) => setNewAdLink(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Advertisement Image</Label>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="adImage"
                  className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-primary"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={imagePreview}
                        alt="Image preview"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Upload image
                      </span>
                    </>
                  )}
                  <Input
                    id="adImage"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsCreateDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAdvertisement}>
              Create Advertisement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Advertisement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>
              Update the details of this advertisement.
            </DialogDescription>
          </DialogHeader>
          {selectedAdvertisement && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="page">Advertisement Page</Label>
                <Select
                  value={newAdPage}
                  onValueChange={(value) =>
                    setNewAdPage(value as AdvertisementType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    {ADVERTISEMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Advertisement Link</Label>
                <Input
                  id="link"
                  placeholder="https://example.com/promotion"
                  value={newAdLink}
                  onChange={(e) => setNewAdLink(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Advertisement Image</Label>
                <div className="flex items-center gap-4">
                  <Label
                    htmlFor="editAdImage"
                    className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-primary"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-32">
                        <Image
                          src={imagePreview}
                          alt="Image preview"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">
                          Change image
                        </span>
                      </>
                    )}
                    <Input
                      id="editAdImage"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateAdvertisement}>
              Update Advertisement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Advertisement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this advertisement? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedAdvertisement && (
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-12 rounded overflow-hidden">
                  <Image
                    src={baseURL + selectedAdvertisement.image}
                    alt={`Advertisement for ${selectedAdvertisement.page}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {selectedAdvertisement.page} Advertisement
                  </p>
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {selectedAdvertisement.link}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdvertisement}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
