"use client";

import { useEffect, useState } from "react";
import styles from "../../app.module.css";
import InnerHeader from "../../InnerHeader";
import { getProfile, saveProfile, type Profile } from "../../auth";
import { useSession } from "../../../session";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  CheckIcon,
} from "../../icons";

const EMPTY: Profile = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  address1: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

export default function PersonalDetailsPage() {
  const { user } = useSession();
  const [form, setForm] = useState<Profile>(EMPTY);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setForm({
      ...EMPTY,
      fullName: p.fullName ?? user?.name ?? "",
      email: p.email ?? user?.email ?? "",
      phone: p.phone ?? "",
      dob: p.dob ?? "",
      address1: p.address1 ?? "",
      city: p.city ?? "",
      state: p.state ?? "",
      zip: p.zip ?? "",
      country: p.country ?? "United States",
    });
  }, [user]);

  const set = (k: keyof Profile, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(form);
    setSaved(true);
  };

  return (
    <div className={styles.screen}>
      <InnerHeader title="Personal details" />

      <form className={styles.body} onSubmit={submit}>
        <p className={styles.formIntro}>
          Keep your information up to date. This is used to verify your identity
          and process cash-outs.
        </p>

        <div className={styles.formGroupTitle}>Identity</div>
        <div className={styles.formGrid}>
          <div>
            <label className={styles.fldLabel}>Full name</label>
            <div className={styles.fldBox}>
              <UserIcon />
              <input
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Ling Chen"
              />
            </div>
          </div>
          <div>
            <label className={styles.fldLabel}>Date of birth</label>
            <div className={styles.fldBox}>
              <CalendarIcon />
              <input
                type="date"
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Contact</div>
        <div className={styles.formGrid}>
          <div>
            <label className={styles.fldLabel}>Email</label>
            <div className={styles.fldBox}>
              <MailIcon />
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className={styles.fldLabel}>Phone number</label>
            <div className={styles.fldBox}>
              <PhoneIcon />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (555) 012-3456"
              />
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.formGroupTitle}>Address</div>
        <div className={styles.formGrid}>
          <div>
            <label className={styles.fldLabel}>Street address</label>
            <div className={styles.fldBox}>
              <MapPinIcon />
              <input
                value={form.address1}
                onChange={(e) => set("address1", e.target.value)}
                placeholder="123 Main St"
              />
            </div>
          </div>
        </div>
        <div className={`${styles.formGrid} ${styles.two}`} style={{ marginTop: 16 }}>
          <div>
            <label className={styles.fldLabel}>City</label>
            <div className={styles.fldBox}>
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Austin"
              />
            </div>
          </div>
          <div>
            <label className={styles.fldLabel}>State</label>
            <div className={styles.fldBox}>
              <input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="TX"
              />
            </div>
          </div>
        </div>
        <div className={`${styles.formGrid} ${styles.two}`} style={{ marginTop: 16 }}>
          <div>
            <label className={styles.fldLabel}>ZIP code</label>
            <div className={styles.fldBox}>
              <input
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
                placeholder="78701"
              />
            </div>
          </div>
          <div>
            <label className={styles.fldLabel}>Country</label>
            <div className={styles.fldBox}>
              <select
                value={form.country}
                onChange={(e) => set("country", e.target.value)}
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.saveBar}>
          {saved && (
            <div className={styles.savedToast}>
              <CheckIcon /> Changes saved
            </div>
          )}
          <button className={styles.btnBlock} type="submit">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
