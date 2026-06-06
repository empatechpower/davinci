"use client";

import { useState } from "react";
import { Save } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ad-border rounded-[16px] overflow-hidden">
      <div className="px-6 py-4 border-b border-ad-border-light">
        <h3 className="text-[15px] font-bold text-ad-dark">{title}</h3>
      </div>
      <div className="p-6 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-ad-dark">{label}</label>
      {children}
      {hint && <p className="text-[12px] text-ad-gray">{hint}</p>}
    </div>
  );
}

const inputCls =
  "border border-ad-border rounded-[8px] px-3 h-10 text-[14px] text-ad-dark outline-none focus:border-ad-purple transition-colors bg-white";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    siteName: "DaVinci Project",
    tagline: "Empowering artists with special needs",
    email: "admin@davinci-project.org",
    artistShare: "60",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Page header */}
      <div>
        <h2 className="text-[20px] font-bold text-ad-dark">Settings</h2>
        <p className="text-[12px] text-ad-gray">Manage platform configuration and preferences</p>
      </div>

      {/* General */}
      <Section title="General">
        <Field label="Site Name">
          <input
            className={inputCls}
            value={general.siteName}
            onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
          />
        </Field>
        <Field label="Tagline" hint="Displayed below the logo and in page metadata.">
          <input
            className={inputCls}
            value={general.tagline}
            onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
          />
        </Field>
        <Field label="Contact Email">
          <input
            type="email"
            className={inputCls}
            value={general.email}
            onChange={(e) => setGeneral({ ...general, email: e.target.value })}
          />
        </Field>
      </Section>

      {/* Revenue */}
      <Section title="Revenue Sharing">
        <Field
          label="Artist Revenue Share (%)"
          hint="Percentage of each sale that goes directly to the artist."
        >
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={100}
              className={`${inputCls} w-28`}
              value={general.artistShare}
              onChange={(e) => setGeneral({ ...general, artistShare: e.target.value })}
            />
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-ad-purple h-2 rounded-full transition-all"
                style={{ width: `${Math.min(100, Number(general.artistShare))}%` }}
              />
            </div>
            <span className="text-[14px] font-semibold text-ad-purple w-10 text-right">
              {general.artistShare}%
            </span>
          </div>
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        {[
          { label: "New order placed", key: "orders" },
          { label: "New user registration", key: "users" },
          { label: "Artist artwork submitted", key: "artworks" },
          { label: "Event registration", key: "events" },
        ].map(({ label, key }) => (
          <label key={key} className="flex items-center justify-between cursor-pointer">
            <span className="text-[14px] text-ad-dark">{label}</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-ad-purple" />
          </label>
        ))}
      </Section>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-ad-purple text-white text-[14px] font-medium rounded-[8px] px-5 h-10 hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
        {saved && (
          <span className="text-[13px] text-green-600 font-medium">
            ✓ Settings saved
          </span>
        )}
      </div>
    </div>
  );
}
