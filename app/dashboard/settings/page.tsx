"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Loader2 } from "lucide-react";
import { getSettings, updateSettings, Settings } from "@/lib/settingsService";

export default function SettingsManagementPage() {
  const { user: authUser } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editedSettings, setEditedSettings] = useState<Partial<Settings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log("Authenticated user:", authUser);
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedSettings = await getSettings();
        setSettings(fetchedSettings || {
          adminCommission: { amount: "", isEnabled: false, type: "" },
          contact_us: { address: "", email: "", phone: "", subject: "", supportURL: "" },
          global: { appVersion: "", privacyPolicy: "", termsAndConditions: "" },
          globalKey: { googleMapKey: "", serverKey: "" },
          globalValue: { distanceType: "", minimumAmountToWithdrawal: "", minimumDepositToRideAccept: "", radius: "" },
          logo: { appFavIconLogo: "", appLogo: "" },
          payment: {
            cash: { enable: false, image: "", name: "" },
            flutterWave: { enable: false, image: "", name: "", encryptionKey: "", isSandbox: false, publicKey: "", secretKey: "" },
            mercadoPago: { enable: false, image: "", name: "", accessToken: "", isSandbox: false, publicKey: "" },
            payStack: { enable: false, image: "", name: "", callbackURL: "", isSandbox: false, publicKey: "", secretKey: "", webhookURL: "" },
            payfast: { enable: false, image: "", name: "", cancel_url: "", isSandbox: false, merchantId: "", merchantKey: "", notify_url: "", return_url: "" },
            paypal: { enable: false, image: "", name: "", braintree_merchantid: "", braintree_privatekey: "", braintree_publickey: "", braintree_tokenizationKey: "", isSandbox: false, paypalAppId: "", paypalSecret: "", paypalUserName: "", paypalpassword: "" },
            paytm: { enable: false, image: "", name: "", isSandbox: false, merchantKey: "", paytmMID: "" },
            razorpay: { enable: false, image: "", name: "", isSandbox: false, razorpayKey: "", razorpaySecret: "" },
            strip: { enable: false, image: "", name: "", clientpublishableKey: "", isSandbox: false, stripeSecret: "" },
            wallet: { enable: false, image: "", name: "" },
          },
          referral: { referralAmount: "" },
        });
        setEditedSettings(fetchedSettings || {});
      } catch (err: any) {
        console.error("Error in fetchSettings:", err);
        setError(`Failed to fetch settings: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSettings("settings", editedSettings);
      setSettings({ ...settings, ...editedSettings });
      setEditedSettings({});
    } catch (err: any) {
      setError(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (path: string[], value: any) => {
    setEditedSettings((prev) => {
      const newSettings = { ...prev };
      let current = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = current[path[i]] || {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  if (isLoading) return <div className="text-center text-muted-foreground">Loading settings...</div>;
  if (error) return <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p className="text-yellow-800 text-sm">{error}</p></div>;
  if (!settings) return <div className="text-center text-muted-foreground">No settings found.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings Management</h1>
        <p className="text-muted-foreground">Configure application settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Admin Commission */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Admin Commission</h3>
            <div className="grid gap-4">
              <div>
                <Label>Amount</Label>
                <Input
                  value={editedSettings.adminCommission?.amount ?? settings.adminCommission.amount}
                  onChange={(e) => handleChange(["adminCommission", "amount"], e.target.value)}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Input
                  value={editedSettings.adminCommission?.type ?? settings.adminCommission.type}
                  onChange={(e) => handleChange(["adminCommission", "type"], e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editedSettings.adminCommission?.isEnabled ?? settings.adminCommission.isEnabled}
                  onCheckedChange={(checked) => handleChange(["adminCommission", "isEnabled"], checked)}
                />
                <Label>Enabled</Label>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="grid gap-4">
              <div>
                <Label>Address</Label>
                <Input
                  value={editedSettings.contact_us?.address ?? settings.contact_us.address}
                  onChange={(e) => handleChange(["contact_us", "address"], e.target.value)}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editedSettings.contact_us?.email ?? settings.contact_us.email}
                  onChange={(e) => handleChange(["contact_us", "email"], e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={editedSettings.contact_us?.phone ?? settings.contact_us.phone}
                  onChange={(e) => handleChange(["contact_us", "phone"], e.target.value)}
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  value={editedSettings.contact_us?.subject ?? settings.contact_us.subject}
                  onChange={(e) => handleChange(["contact_us", "subject"], e.target.value)}
                />
              </div>
              <div>
                <Label>Support URL</Label>
                <Input
                  type="url"
                  value={editedSettings.contact_us?.supportURL ?? settings.contact_us.supportURL}
                  onChange={(e) => handleChange(["contact_us", "supportURL"], e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Global */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Global</h3>
            <div className="grid gap-4">
              <div>
                <Label>App Version</Label>
                <Input
                  value={editedSettings.global?.appVersion ?? settings.global.appVersion}
                  onChange={(e) => handleChange(["global", "appVersion"], e.target.value)}
                />
              </div>
              <div>
                <Label>Privacy Policy</Label>
                <Textarea
                  value={editedSettings.global?.privacyPolicy ?? settings.global.privacyPolicy}
                  onChange={(e) => handleChange(["global", "privacyPolicy"], e.target.value)}
                  className="h-32"
                />
              </div>
              <div>
                <Label>Terms and Conditions</Label>
                <Textarea
                  value={editedSettings.global?.termsAndConditions ?? settings.global.termsAndConditions}
                  onChange={(e) => handleChange(["global", "termsAndConditions"], e.target.value)}
                  className="h-32"
                />
              </div>
            </div>
          </div>

          {/* Global Key */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Global Key</h3>
            <div className="grid gap-4">
              <div>
                <Label>Google Map Key</Label>
                <Input
                  value={editedSettings.globalKey?.googleMapKey ?? settings.globalKey.googleMapKey}
                  onChange={(e) => handleChange(["globalKey", "googleMapKey"], e.target.value)}
                />
              </div>
              <div>
                <Label>Server Key</Label>
                <Input
                  value={editedSettings.globalKey?.serverKey ?? settings.globalKey.serverKey}
                  onChange={(e) => handleChange(["globalKey", "serverKey"], e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Global Value */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Global Value</h3>
            <div className="grid gap-4">
              <div>
                <Label>Distance Type</Label>
                <Input
                  value={editedSettings.globalValue?.distanceType ?? settings.globalValue.distanceType}
                  onChange={(e) => handleChange(["globalValue", "distanceType"], e.target.value)}
                />
              </div>
              <div>
                <Label>Minimum Amount to Withdrawal</Label>
                <Input
                  type="number"
                  value={editedSettings.globalValue?.minimumAmountToWithdrawal ?? settings.globalValue.minimumAmountToWithdrawal}
                  onChange={(e) => handleChange(["globalValue", "minimumAmountToWithdrawal"], e.target.value)}
                />
              </div>
              <div>
                <Label>Minimum Deposit to Ride Accept</Label>
                <Input
                  type="number"
                  value={editedSettings.globalValue?.minimumDepositToRideAccept ?? settings.globalValue.minimumDepositToRideAccept}
                  onChange={(e) => handleChange(["globalValue", "minimumDepositToRideAccept"], e.target.value)}
                />
              </div>
              <div>
                <Label>Radius</Label>
                <Input
                  type="number"
                  value={editedSettings.globalValue?.radius ?? settings.globalValue.radius}
                  onChange={(e) => handleChange(["globalValue", "radius"], e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Logo</h3>
            <div className="grid gap-4">
              <div>
                <Label>App Fav Icon Logo</Label>
                <Input
                  type="url"
                  value={editedSettings.logo?.appFavIconLogo ?? settings.logo.appFavIconLogo}
                  onChange={(e) => handleChange(["logo", "appFavIconLogo"], e.target.value)}
                />
              </div>
              <div>
                <Label>App Logo</Label>
                <Input
                  type="url"
                  value={editedSettings.logo?.appLogo ?? settings.logo.appLogo}
                  onChange={(e) => handleChange(["logo", "appLogo"], e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            {Object.entries(settings.payment).map(([method, data]) => (
              <Collapsible key={method} className="border rounded-md">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-gray-100">
                  <span>{(data as any).name || method}</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={(editedSettings.payment?.[method as keyof Payment]?.enable as boolean) ?? (data as any).enable}
                      onCheckedChange={(checked) => handleChange(["payment", method, "enable"], checked)}
                    />
                    <Label>Enabled</Label>
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      type="url"
                      value={(editedSettings.payment?.[method as keyof Payment]?.image as string) ?? (data as any).image}
                      onChange={(e) => handleChange(["payment", method, "image"], e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={(editedSettings.payment?.[method as keyof Payment]?.name as string) ?? (data as any).name}
                      onChange={(e) => handleChange(["payment", method, "name"], e.target.value)}
                    />
                  </div>
                  {method === "flutterWave" && (
                    <>
                      <div>
                        <Label>Encryption Key</Label>
                        <Input
                          value={(editedSettings.payment?.flutterWave?.encryptionKey as string) ?? (data as any).encryptionKey}
                          onChange={(e) => handleChange(["payment", "flutterWave", "encryptionKey"], e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Public Key</Label>
                        <Input
                          value={(editedSettings.payment?.flutterWave?.publicKey as string) ?? (data as any).publicKey}
                          onChange={(e) => handleChange(["payment", "flutterWave", "publicKey"], e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Secret Key</Label>
                        <Input
                          value={(editedSettings.payment?.flutterWave?.secretKey as string) ?? (data as any).secretKey}
                          onChange={(e) => handleChange(["payment", "flutterWave", "secretKey"], e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={(editedSettings.payment?.flutterWave?.isSandbox as boolean) ?? (data as any).isSandbox}
                          onCheckedChange={(checked) => handleChange(["payment", "flutterWave", "isSandbox"], checked)}
                        />
                        <Label>Sandbox</Label>
                      </div>
                    </>
                  )}
                  {/* Add similar fields for other payment methods as needed */}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          {/* Referral */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Referral</h3>
            <div className="grid gap-4">
              <div>
                <Label>Referral Amount</Label>
                <Input
                  type="number"
                  value={editedSettings.referral?.referralAmount ?? settings.referral.referralAmount}
                  onChange={(e) => handleChange(["referral", "referralAmount"], e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Changes
          </Button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}