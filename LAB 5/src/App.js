import React, { useState } from "react";
import "./App.css";

export default function App() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    occupation: "employed",
    organizationName: "",
    termsAccepted: false,
  });

  // Validation & Toast States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast System
  const addToast = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // Input Handler with Input Formatting Rules
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Reset organization input when occupation changes
    if (name === "occupation") {
      setFormData((prev) => ({ ...prev, occupation: value, organizationName: "" }));
      if (errors.organizationName) setErrors((prev) => ({ ...prev, organizationName: "" }));
      return;
    }

    let cleanValue = type === "checkbox" ? checked : value;

    // RULE 1: Strict String-Only Inputs (Full Name, Company/School Name)
    if (name === "fullName" || name === "organizationName") {
      // Allow only letters, spaces, hyphens, and apostrophes
      cleanValue = value.replace(/[^a-zA-Z\s'-]/g, "");
    }

    // RULE 2: Strict Number-Only Input (Phone Number)
    if (name === "phone") {
      // Allow only numeric digits, max 10 characters
      cleanValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));

    // Clear field errors as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Comprehensive Logic Validation
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name (String Validation)
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Name must be at least 3 letters.";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.fullName)) {
      newErrors.fullName = "Full name can only contain letters.";
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // 3. Phone Number (Number Validation - Exactly 10 digits)
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // 4. Date of Birth Validation
    if (!formData.dob) {
      newErrors.dob = "Please select your date of birth.";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        newErrors.dob = "You must be at least 18 years old.";
      }
    }

    // 5. Gender
    if (!formData.gender) {
      newErrors.gender = "Select a gender option.";
    }

    // 6. Dynamic String Field Validation based on Occupation
    if (
      (formData.occupation === "employed" || formData.occupation === "self-employed") &&
      !formData.organizationName.trim()
    ) {
      newErrors.organizationName = "Company name is required (letters only).";
    } else if (formData.occupation === "student" && !formData.organizationName.trim()) {
      newErrors.organizationName = "School or college name is required (letters only).";
    }

    // 7. Terms & Conditions
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept terms to continue.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast("Please fix the highlighted fields.", "error");
      return;
    }

    setIsSubmitting(true);
    addToast("Encrypting profile data...", "info");

    setTimeout(() => {
      addToast("Validating type constraints...", "info");
    }, 1200);

    setTimeout(() => {
      setIsSubmitting(false);
      addToast("Membership Profile Activated!", "success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        occupation: "employed",
        organizationName: "",
        termsAccepted: false,
      });
    }, 2800);
  };

  return (
    <div className="dark-container">
      <div className="bg-glow"></div>

      {/* Toast System */}
      <div className="toast-wrapper">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" && "✦"}
              {toast.type === "error" && "✕"}
              {toast.type === "info" && "●"}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      <div className="bento-wrapper">
        <header className="bento-header">
          <div className="badge">
            <span className="badge-dot"></span> Profile Portal
          </div>
          <h1 className="title">Create Profile</h1>
          <p className="subtitle">
            Configure your account identity with enterprise-grade precision.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bento-grid" noValidate>
          {/* Card 1: Full Name (Letters Only) */}
          <div className="bento-card span-12">
            <div className="card-tag">Identity (Letters Only)</div>
            <div className="input-group">
              <label className="input-label">Full Legal Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Alexander Vance"
                value={formData.fullName}
                onChange={handleChange}
                className={`input-field ${errors.fullName ? "input-error" : ""}`}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
          </div>

          {/* Card 2: Contact Info */}
          <div className="bento-card span-6">
            <div className="card-tag">Contact</div>
            <div className="input-group">
              <label className="input-label">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="alexander@domain.com"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          {/* Card 3: Phone Number (Numbers Only) */}
          <div className="bento-card span-6">
            <div className="card-tag">
              Communication (Digits Only)
              <span className="char-count">{formData.phone.length}/10</span>
            </div>
            <div className="input-group">
              <label className="input-label">Phone Number *</label>
              <input
                type="text"
                inputMode="numeric"
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field ${errors.phone ? "input-error" : ""}`}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          {/* Card 4: Date of Birth */}
          <div className="bento-card span-6">
            <div className="card-tag">Verification</div>
            <div className="input-group">
              <label className="input-label">Date of Birth (Calendar) *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`input-field date-picker ${errors.dob ? "input-error" : ""}`}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>
          </div>

          {/* Card 5: Gender */}
          <div className="bento-card span-6">
            <div className="card-tag">Demographics</div>
            <div className="input-group">
              <label className="input-label">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`input-field ${errors.gender ? "input-error" : ""}`}
              >
                <option value="">Select identity</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Non-binary / Other</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>
          </div>

          {/* Card 6: Dynamic Occupation Logic */}
          <div className="bento-card span-12">
            <div className="card-tag">Professional Profile</div>
            <div className="dynamic-flex">
              <div className="input-group flex-1">
                <label className="input-label">Employment Status *</label>
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed / Founder</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>

              {/* Conditional Option A: Employed (Letters Only) */}
              {(formData.occupation === "employed" || formData.occupation === "self-employed") && (
                <div className="input-group flex-1">
                  <label className="input-label">Company or Organization (Letters Only) *</label>
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="e.g. Acme Technologies"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className={`input-field ${errors.organizationName ? "input-error" : ""}`}
                  />
                  {errors.organizationName && (
                    <span className="error-text">{errors.organizationName}</span>
                  )}
                </div>
              )}

              {/* Conditional Option B: Student (Letters Only) */}
              {formData.occupation === "student" && (
                <div className="input-group flex-1">
                  <label className="input-label">School / University (Letters Only) *</label>
                  <input
                    type="text"
                    name="organizationName"
                    placeholder="e.g. Stanford University"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className={`input-field ${errors.organizationName ? "input-error" : ""}`}
                  />
                  {errors.organizationName && (
                    <span className="error-text">{errors.organizationName}</span>
                  )}
                </div>
              )}

              {/* Conditional Option C: Unemployed */}
              {formData.occupation === "unemployed" && (
                <div className="info-banner flex-1">
                  <span className="info-icon">ℹ</span> No institutional affiliation required for setup.
                </div>
              )}
            </div>
          </div>

          {/* Card 7: Terms & Submit */}
          <div className="bento-card span-12 action-card">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                />
                <span>
                  I accept the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
                </span>
              </label>
              {errors.termsAccepted && <span className="error-text">{errors.termsAccepted}</span>}
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-button">
              {isSubmitting ? <span>Processing...</span> : <span>Complete Registration ➔</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}