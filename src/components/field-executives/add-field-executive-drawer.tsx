"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Eye, EyeOff, Loader2, User, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/auth/password-input";
import {
  createFieldExecutive,
  listAreas,
} from "@/services/field-executive.service";
import { ApiError } from "@/lib/auth/api-error";
import {
  validateFieldExecutiveForm,
  type FieldExecutiveFormErrors,
} from "@/lib/field-executives/validation";
import type {
  CreateFieldExecutiveResult,
  DairyFieldExecutive,
} from "@/types/field-executive";

type PasswordMode = "GENERATE" | "TEMPORARY";

const CUSTOM_AREA_VALUE = "__custom__";

function emptyErrors(): FieldExecutiveFormErrors {
  return {};
}

export function AddFieldExecutiveDrawer({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (fe: DairyFieldExecutive) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [isCustomArea, setIsCustomArea] = useState(false);
  const [customArea, setCustomArea] = useState("");
  const [address, setAddress] = useState("");

  const [passwordMode, setPasswordMode] = useState<PasswordMode>("GENERATE");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const [errors, setErrors] = useState<FieldExecutiveFormErrors>(
    emptyErrors(),
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CreateFieldExecutiveResult | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const assignedArea = isCustomArea ? customArea : selectedArea;

  useEffect(() => {
    if (!open) return;
    if (initialized.current) return;
    initialized.current = true;

    void listAreas().then(setAreas);
  }, [open]);

  useEffect(() => {
    if (!open) {
      initialized.current = false;
      const timeout = setTimeout(() => {
        setFullName("");
        setMobile("");
        setEmail("");
        setPhotoFile(null);
        setPhotoPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setSelectedArea("");
        setIsCustomArea(false);
        setCustomArea("");
        setAddress("");
        setPasswordMode("GENERATE");
        setTemporaryPassword("");
        setErrors(emptyErrors());
        setApiError(null);
        setResult(null);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function clearPhoto() {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function runValidation(): boolean {
    const validationErrors = validateFieldExecutiveForm({
      fullName,
      mobile,
      email,
      assignedArea,
      passwordMode,
      temporaryPassword,
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }

  const isFormInvalid = useMemo(() => {
    if (!fullName.trim() || !mobile.trim() || !assignedArea.trim()) return true;
    if (passwordMode === "TEMPORARY" && temporaryPassword.length < 8) return true;
    return false;
  }, [fullName, mobile, assignedArea, passwordMode, temporaryPassword]);

  async function handleSubmit() {
    setApiError(null);
    if (!runValidation()) return;

    setIsSubmitting(true);
    try {
      const response = await createFieldExecutive({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim() || undefined,
        assignedArea: assignedArea.trim(),
        address: address.trim() || undefined,
        profilePhotoFile: photoFile,
        passwordMode,
        temporaryPassword:
          passwordMode === "TEMPORARY" ? temporaryPassword : undefined,
      });
      setResult(response);
      onCreated(response.fieldExecutive);
    } catch (error) {
      if (error instanceof ApiError) {
        setApiError(error.message);
      } else {
        setApiError("Unable to create field executive. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDone() {
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-lg">
        {result ? (
          <SuccessView result={result} onDone={handleDone} />
        ) : (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle>Add Dairy Field Executive</SheetTitle>
              <SheetDescription>
                Create an account for a field executive and assign their
                operating area.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
              {apiError && (
                <Alert variant="destructive" role="alert">
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}

              <section className="space-y-4">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Personal Information
                </h3>

                <div className="flex items-center gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                    {photoPreviewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreviewUrl}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="h-8 max-w-[220px] text-xs"
                      />
                      {photoFile && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={clearPhoto}
                          aria-label="Remove photo"
                        >
                          <X className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optional profile photo.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    onBlur={runValidation}
                    aria-invalid={Boolean(errors.fullName)}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    inputMode="numeric"
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={(event) =>
                      setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    onBlur={runValidation}
                    aria-invalid={Boolean(errors.mobile)}
                  />
                  {errors.mobile && (
                    <p className="text-sm text-destructive">{errors.mobile}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Optional"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={runValidation}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
              </section>

              <section className="space-y-4 border-t border-border pt-6">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Employee Information
                </h3>

                <div className="space-y-1.5">
                  <Label>Employee ID</Label>
                  <Input
                    readOnly
                    value="Auto-generated on save"
                    className="bg-muted/50 text-muted-foreground italic"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Assigned Area</Label>
                  {isCustomArea ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={customArea}
                        onChange={(event) => setCustomArea(event.target.value)}
                        onBlur={runValidation}
                        placeholder="Enter new area"
                        aria-invalid={Boolean(errors.assignedArea)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsCustomArea(false);
                          setCustomArea("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={selectedArea}
                      onValueChange={(value) => {
                        if (value === CUSTOM_AREA_VALUE) {
                          setIsCustomArea(true);
                          return;
                        }
                        setSelectedArea(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                        <SelectItem value={CUSTOM_AREA_VALUE}>
                          Add new area…
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {errors.assignedArea && (
                    <p className="text-sm text-destructive">
                      {errors.assignedArea}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Optional"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </div>
              </section>

              <section className="space-y-4 border-t border-border pt-6">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Login Credentials
                </h3>

                <div className="space-y-1.5">
                  <Label>Login ID</Label>
                  <Input
                    readOnly
                    value="Same as Employee ID"
                    className="bg-muted/50 text-muted-foreground italic"
                  />
                  <p className="text-xs text-muted-foreground">
                    The auto-generated Employee ID is also the field
                    executive&apos;s login username.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 transition-colors has-aria-checked:border-primary/50 has-aria-checked:bg-primary/[0.04]">
                    <input
                      type="radio"
                      name="passwordMode"
                      className="mt-0.5 accent-primary"
                      checked={passwordMode === "GENERATE"}
                      onChange={() => setPasswordMode("GENERATE")}
                    />
                    <span className="space-y-0.5">
                      <span className="block text-sm font-medium text-foreground">
                        Generate Secure Password
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        A secure temporary password will be generated
                        automatically.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-border p-3 transition-colors has-aria-checked:border-primary/50 has-aria-checked:bg-primary/[0.04]">
                    <input
                      type="radio"
                      name="passwordMode"
                      className="mt-0.5 accent-primary"
                      checked={passwordMode === "TEMPORARY"}
                      onChange={() => setPasswordMode("TEMPORARY")}
                    />
                    <span className="block flex-1 space-y-1.5">
                      <span className="block text-sm font-medium text-foreground">
                        Set Temporary Password
                      </span>
                      {passwordMode === "TEMPORARY" && (
                        <span className="block">
                          <PasswordInput
                            value={temporaryPassword}
                            onChange={(event) =>
                              setTemporaryPassword(event.target.value)
                            }
                            onBlur={runValidation}
                            placeholder="Minimum 8 characters"
                            aria-invalid={Boolean(errors.temporaryPassword)}
                          />
                          {errors.temporaryPassword && (
                            <span className="mt-1 block text-sm text-destructive">
                              {errors.temporaryPassword}
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              </section>
            </div>

            <SheetFooter className="border-t border-border">
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting || isFormInvalid}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Field Executive"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function SuccessView({
  result,
  onDone,
}: {
  result: CreateFieldExecutiveResult;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `Login ID: ${result.loginId}\nTemporary Password: ${result.temporaryPassword}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="border-b border-border">
        <SheetTitle>Field Executive Created Successfully</SheetTitle>
        <SheetDescription>
          Share the login details below with {result.fieldExecutive.fullName}.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-4 px-4 pb-4">
        <div className="divide-y divide-border rounded-lg border border-border text-sm">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-foreground">
              {result.fieldExecutive.fullName}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="text-muted-foreground">Employee ID</span>
            <span className="font-mono font-medium text-foreground">
              {result.fieldExecutive.employeeId}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="text-muted-foreground">Login ID</span>
            <span className="font-mono font-medium text-foreground">
              {result.loginId}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="text-muted-foreground">Temporary Password</span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <code className="font-mono tracking-wide">
                {visible
                  ? result.temporaryPassword
                  : "•".repeat(result.temporaryPassword.length)}
              </code>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setVisible((prev) => !prev)}
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </Button>
            </span>
          </div>
        </div>

        <Alert className="border-warning/30 bg-warning/10">
          <AlertDescription className="text-warning-foreground">
            Share these credentials securely with the field executive.
          </AlertDescription>
        </Alert>
      </div>

      <SheetFooter className="flex-row gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy Login Details"}
        </Button>
        <Button type="button" className="flex-1" onClick={onDone}>
          Done
        </Button>
      </SheetFooter>
    </div>
  );
}
