"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { GrAdd } from "react-icons/gr";
import Link from "next/link";
import { GMContext } from "@/app/(utils)/context/GMContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { content } from "html2canvas/dist/types/css/property-descriptors/content";

const webSettingFormSchema = z.object({
  registration_points: z.string(),
  platform_fee: z.string(),
});

export default function Setting() {
  let [setting, setSetting] = useState<any>(null);
  let [levels, setLevels] = useState<any>([]);
  let [homepageBanners, setHomepageBanners] = useState<any>([]);
  let [homepageSections, setHomepageSections] = useState<any>([]);
  let [sectionItems, setSectionItems] = useState<any>([]);
  let api = useAxios();
  let { baseURL } = useContext(GMContext);

  const urlToBlob = async (url: string | URL | Request) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const blobToFile = (blob: Blob, filename: string) => {
    const file = new File([blob], filename, { type: blob.type });
    return file;
  };

  let getLevels = async () => {
    let response = await api.get("/admin/getLevels/");
    console.log(response);
    if (response.status === 200) {
      setLevels(response.data);
    }
  };

  let getHomepageBanners = async () => {
    let response = await api.get("/admin/getHomepageBanners/");
    console.log(response);
    if (response.status === 200) {
      setHomepageBanners(response.data);
      response.data.forEach((e: any) => {
        let parts = e["image"].split("/");
        let imageName = parts[parts.length - 1];
        urlToBlob(`${baseURL}${e["image"]}`).then((blob) => {
          const filename = imageName;
          e["file"] = blobToFile(blob, filename);
        });
      });
    }
  };

  let getHomepageSections = async () => {
    let response = await api.get("/admin/getHomepageSections/");
    console.log(response);
    if (response.status === 200) {
      setHomepageSections(response.data);
    }
  };

  let addHomePageSection = () => {
    let newSection = { name: "", display_order: 0, content_type: "" };
    setHomepageSections((section: any) => [...section, newSection]);
  };

  let createMultipleHomepageSection = async () => {
    let response = await api.post(
      "/admin/createMultipleHomepageSection/",
      homepageSections
    );
    if (response.status === 201) {
      getHomepageSections();
      toast.success("Homepage Sections created successfully");
    } else {
      toast.error("Failed to create Homepage Sections");
    }
  };

  let getSectionItems = async () => {
    let response = await api.get("/admin/getHomepageItems/");
    console.log(response);
    if (response.status === 200) {
      setSectionItems(response.data);
    }
  };

  let addSectionItem = (section: number) => {
    let newSectionItem = {
      id: Date.now(),
      section: section,
      product: null,
      category: null,
    };
    setSectionItems((prevItems: any) => [...prevItems, newSectionItem]);
  };

  let createMultipleSectionItems = async () => {
    let cleanedSectionItems = sectionItems.map(({ id, ...rest }: any) => rest);
    let response = await api.post(
      "/admin/createMultipleHomepageItem/",
      cleanedSectionItems
    );
    if (response.status === 201) {
      getHomepageSections();
      toast.success("Homepage Sections Items created successfully");
    } else {
      toast.error("Failed to create Homepage Sections Items");
    }
  };

  let addLevel = () => {
    let newLevels = { points: 0 };
    setLevels((level: any) => [...level, newLevels]);
  };
  let removeLevel = (index: number) => {
    setLevels((level: any) => level.filter((_: any, i: number) => i !== index));
  };
  let changeLevel = (index: number, value: number) => {
    setLevels((level: any) =>
      level.map((l: any, i: number) =>
        i === index ? { ...l, points: value } : l
      )
    );
  };

  let addHomepageBanner = () => {
    let newBanner = { link: "", file: "" };
    setHomepageBanners((banner: any) => [...banner, newBanner]);
  };

  let removeHomepageBanner = (index: number) => {
    setHomepageBanners((banner: any) =>
      banner.filter((_: any, i: number) => i !== index)
    );
  };

  let createMultipleHomepageBanner = async () => {
    let formData = new FormData();
    homepageBanners.forEach((banner: any, index: number) => {
      formData.append("banner-" + index, banner.file);
      formData.append("link-" + index, banner.link);
    });
    let response = await api.post(
      "/admin/createMultipleHomepageBanner/",
      formData
    );
    if (response.status === 201) {
      getHomepageBanners();
      toast.success("Homepage Banners created successfully");
    } else {
      toast.error("Failed to create Homepage Banners");
    }
  };

  let getSetting = async () => {
    let response = await api.get("/admin/getSetting/");
    console.log(response.data);
    if (response.status === 200) {
      if (response.data.registration_points === null) {
        setSetting({ registration_points: 0 });
        webSettingForm.reset({ registration_points: "0" });
      } else {
        setSetting(response.data);
        webSettingForm.reset({
          registration_points: response.data.registration_points.toString(),
          platform_fee: response.data.platform_fee.toString(),
        });
      }
    }
  };

  let updateSetting = async (data: any) => {
    let response = await api.post("/admin/updateSetting/", data);
    if (response.status === 200) {
      getSetting();
      toast.success("Setting updated successfully");
    } else {
      toast.error("Failed to update setting");
    }
  };

  let updateLevels = async () => {
    let response = await api.post("/admin/updateLevels/", levels);
    if (response.status === 201) {
      getLevels();
      toast.success("Levels updated successfully");
    } else {
      toast.error("Failed to update levels");
    }
  };

  useEffect(() => {
    getSetting();
    getLevels();
    getHomepageBanners();
    getHomepageSections();
    getSectionItems();
  }, []);

  const webSettingForm = useForm<z.infer<typeof webSettingFormSchema>>({
    resolver: zodResolver(webSettingFormSchema),
    defaultValues: {
      registration_points: "0",
    },
  });

  function onSubmit(values: z.infer<typeof webSettingFormSchema>) {
    updateSetting(values);
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-2 gap-5">
      <div className="flex flex-col gap-5 p-5 col-span-1 rounded-md bg-gray-200">
        <Form {...webSettingForm}>
          <form
            onSubmit={webSettingForm.handleSubmit(onSubmit)}
            className="space-y-5 lg:space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-bold w-full text-red-500">
                WEB Settings
              </span>
              <Button type="submit" variant={"outline"}>
                <CheckIcon />
              </Button>
            </div>
            <FormField
              control={webSettingForm.control}
              name="registration_points"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-5">
                    <FormLabel className="w-full lg:w-1/4">
                      Registration Points
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="w-3/4" />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={webSettingForm.control}
              name="platform_fee"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center lg:gap-5">
                    <FormLabel className="w-full lg:w-1/4">
                      Platform Fee
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="w-3/4" />
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="flex justify-center flex-col gap-5 p-5 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="font-bold w-full text-red-500">
            Level Wise Distributions
          </span>
          <Button onClick={updateLevels} variant={"outline"}>
            <CheckIcon />
          </Button>
          <Button onClick={addLevel} variant={"outline"}>
            <GrAdd />
          </Button>
        </div>
        <div>
          <div className="flex flex-col gap-5 col-span-1 ">
            {levels.map((level: any, index: number) => (
              <div key={index} className="flex items-center gap-5">
                <span className="text-sm whitespace-nowrap font-bold">
                  Level {index + 1}
                </span>
                <Input
                  type="number"
                  value={level.points}
                  onChange={(e) =>
                    changeLevel(
                      index,
                      e.target.value ? parseInt(e.target.value) : NaN
                    )
                  }
                />
                <Button
                  onClick={() => removeLevel(index)}
                  variant={"destructive"}
                >
                  <Cross1Icon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 col-span-1 rounded-md bg-gray-200">
        <div className="flex justify-between gap-2">
          <span className="font-bold w-full text-red-500">
            Homepage Banners
          </span>
          <Button variant={"outline"} onClick={createMultipleHomepageBanner}>
            <CheckIcon />
          </Button>
          <Button variant={"outline"} onClick={addHomepageBanner}>
            <GrAdd />
          </Button>
        </div>
        <div>
          <div className="flex flex-col gap-10 col-span-1 ">
            {homepageBanners.map((banner: any, index: number) => (
              <div key={index} className="flex items-center gap-5">
                <span className="text-sm whitespace-nowrap font-bold">
                  Banner {index + 1}
                </span>
                <div>
                  <Input
                    type="file"
                    className="bg-white"
                    onChange={(e) =>
                      setHomepageBanners((banners: any) =>
                        banners.map((b: any, i: number) =>
                          i === index
                            ? {
                                ...b,
                                file: e.target.files ? e.target.files[0] : null,
                              }
                            : b
                        )
                      )
                    }
                  />
                  {banner.image && (
                    <Link
                      className="text-blue-500 text-xs absolute"
                      target="_blank"
                      href={baseURL + banner.image}
                    >
                      View Image
                    </Link>
                  )}
                </div>

                <Input
                  type="text"
                  className="bg-white"
                  value={banner.link}
                  placeholder="Link"
                  onChange={(e) =>
                    setHomepageBanners((banners: any) =>
                      banners.map((b: any, i: number) =>
                        i === index ? { ...b, link: e.target.value } : b
                      )
                    )
                  }
                />
                <Button
                  onClick={() => removeHomepageBanner(index)}
                  variant={"destructive"}
                >
                  <Cross1Icon />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col gap-5 p-5 bg-gray-100 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="font-bold w-full text-red-500">
            Homepage Sections
          </span>
          <Button onClick={createMultipleHomepageSection} variant={"outline"}>
            <CheckIcon />
          </Button>
          <Button onClick={addHomePageSection} variant={"outline"}>
            <GrAdd />
          </Button>
        </div>
        <div>
          <div className="flex flex-col gap-5 col-span-1 ">
            {homepageSections.map((section: any, index: number) => (
              <div key={index} className="flex flex-col items-center gap-5">
                <div className="flex gap-5 w-full">
                  <Select
                    value={section.name}
                    onValueChange={(e) =>
                      setHomepageSections((sections: any) =>
                        sections.map((s: any, i: number) =>
                          i === index ? { ...s, name: e } : s
                        )
                      )
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Section Name" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Top Deals">Top Deals</SelectItem>
                      <SelectItem value="Recommended for You">
                        Recommended for You
                      </SelectItem>
                      <SelectItem value="Featured Items">
                        Featured Items
                      </SelectItem>
                      <SelectItem value="Shop by Category">
                        Shop by Category
                      </SelectItem>
                      <SelectItem value="New Arrivals">New Arrivals</SelectItem>
                      <SelectItem value="Trending Products">
                        Trending Products
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={section.content_type?.toString()}
                    onValueChange={(e) =>
                      setHomepageSections((sections: any) =>
                        sections.map((s: any, i: number) =>
                          i === index ? { ...s, content_type: e } : s
                        )
                      )
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Section Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Category">Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-5 w-full">
                  <Input
                    type="number"
                    className="bg-white w-full"
                    value={section.display_order}
                    placeholder="Order"
                    onChange={(e) =>
                      setHomepageSections((sections: any) =>
                        sections.map((s: any, i: number) =>
                          i === index
                            ? { ...s, display_order: e.target.value }
                            : s
                        )
                      )
                    }
                  />
                  <Button
                    onClick={() => {
                      setHomepageSections((sections: any) =>
                        sections.filter((_: any, i: number) => i !== index)
                      );
                    }}
                    variant={"destructive"}
                  >
                    <Cross1Icon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 col-span-full rounded-md bg-gray-200">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="font-bold w-full text-red-500">
              Homepage Sections Items
            </span>
            <Button
              onClick={createMultipleSectionItems}
              variant={"outline"}
              className="bg-green-500 text-white"
            >
              <CheckIcon />
            </Button>
          </div>

          {homepageSections.map((section: any, index: number) => (
            <div
              key={index}
              className="flex flex-col gap-5 bg-white p-1 rounded-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap font-bold w-full text-violet-500">
                  {section.name} ({section.content_type})
                </span>

                <Button
                  onClick={() => addSectionItem(section.id)}
                  variant={"outline"}
                  className="bg-blue-500 text-white"
                >
                  <GrAdd />
                </Button>
              </div>
              <div>
                <div className="flex flex-col gap-5 col-span-1">
                  {sectionItems
                    .filter((item: any) => item.section === section.id)
                    .map((item: any, index: number) => (
                      <div key={item.id} className="flex items-center gap-5">
                        <span className="text-sm whitespace-nowrap font-bold">
                          Item {index + 1}
                        </span>
                        {section.content_type == "Product" && (
                          <Input
                            type="number"
                            value={item.product}
                            placeholder="Product ID"
                            onChange={(e) =>
                              setSectionItems((items: any) =>
                                items.map((i: any) =>
                                  i.id === item.id
                                    ? { ...i, product: e.target.value }
                                    : i
                                )
                              )
                            }
                          />
                        )}
                        {section.content_type == "Category" && (
                          <Input
                            type="number"
                            value={item.category}
                            placeholder="Category ID"
                            onChange={(e) =>
                              setSectionItems((items: any) =>
                                items.map((i: any) =>
                                  i.id === item.id
                                    ? { ...i, category: e.target.value }
                                    : i
                                )
                              )
                            }
                          />
                        )}
                        <Button
                          onClick={() =>
                            setSectionItems((items: any) =>
                              items.filter((i: any) => i.id !== item.id)
                            )
                          }
                          variant={"destructive"}
                        >
                          <Cross1Icon />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
