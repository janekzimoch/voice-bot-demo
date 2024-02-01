import React from "react";
import { Settings } from "~/types";
import TextField from "~/components/SettingsBox/TextField";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";

enum InputSizes {
  sm = 1,
  md = 2,
  lg = 6,
  xl = 18,
}

const settingsMap: Record<keyof Settings, { label: string; numRows: number }> =
  {
    salesperson_name: { label: "Salesperson Name", numRows: InputSizes.sm },
    salesperson_role: { label: "Salesperson Role", numRows: InputSizes.md },
    company_name: { label: "Company Name", numRows: InputSizes.sm },
    company_business: { label: "Company Business", numRows: InputSizes.lg },
    company_values: { label: "Company Values", numRows: InputSizes.lg },
    conversation_purpose: {
      label: "Chat Purpose",
      numRows: InputSizes.lg,
    },
    custom_prompt: { label: "Custom Prompt", numRows: InputSizes.xl },
  };

export default function SettingsBox({
  initialSettings,
  id,
}: {
  initialSettings: Settings | null;
  id: number;
}) {
  const session = useSession();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Settings>({
    defaultValues: {
      salesperson_name: initialSettings?.salesperson_name,
      salesperson_role: initialSettings?.salesperson_role,
      company_name: initialSettings?.company_name,
      company_business: initialSettings?.company_business,
      company_values: initialSettings?.company_values,
      conversation_purpose: initialSettings?.conversation_purpose,
      custom_prompt: initialSettings?.custom_prompt,
    },
  });
  const onSubmit: SubmitHandler<Settings> = async (data) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/settings/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(data),
      },
    ).then((response) => response.json());
  };

  return (
    <div className="relative  drop-shadow-md">
      <div className="absolute left-14 top-0 z-30 -translate-y-1/2 bg-transparent p-1 text-xl font-light text-gray-400">
        Settings
      </div>
      <div className="absolute left-12 top-0 z-20 h-[6px] w-[100px] -translate-y-1/2 bg-white"></div>
      <div className="z-10 h-full w-full overflow-clip rounded-[20px] border-[2px] border-prm-green bg-prm-white">
        <div className="h-[calc(100vh-112px)] w-full flex-col overflow-y-scroll px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full justify-end">
              <input
                type="submit"
                value="Update"
                className="mb-2 block w-[100px] cursor-pointer items-center overflow-hidden rounded-full  border-[2px] border-solid border-prm-green bg-prm-white px-4 py-[4px] text-sm font-normal tracking-wider text-prm-green  drop-shadow-md  transition-all hover:bg-prm-green/20"
              />
            </div>
            {Object.entries(settingsMap).map(([name, settings], index) => (
              <Controller
                key={index}
                name={name as keyof Settings}
                control={control}
                render={({ field: { onChange, name, value, ...rest } }) => (
                  <TextField
                    label={settings.label}
                    rows={settings.numRows}
                    onChange={onChange}
                    name={name}
                    value={value}
                  />
                )}
              />
            ))}
          </form>
        </div>
      </div>
    </div>
  );
}
