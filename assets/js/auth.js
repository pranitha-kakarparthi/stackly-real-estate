/* ==========================================================================
   STACKLY REAL ESTATE - AUTHENTICATION CONTROLLER (auth.js)
   Universal Valid Sign-In Enabled (Any Valid Email & Password Accepted)
   Sign-Up Resets Form & Redirects after 1s
   Zero Demo Logins
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initPasswordStrengthMeter();
  initSignUpForm();
  initSignInForm();
});

/* ==========================================================================
   STRICT VALIDATION HELPERS
   ========================================================================== */

/**
 * Validates email against strict RFC format, length, and character constraints:
 * - Length: 6 to 254 characters
 * - No consecutive dots ('..')
 * - Local part: 1 to 64 chars, alphanumeric, allows . _ % + -
 * - Domain part: alphanumeric, hyphens, valid TLD of at least 2 alpha chars
 */
function validateStrictEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, message: "Email address is required" };
  }
  const val = email.trim();
  if (!val) {
    return { valid: false, message: "Email address is required" };
  }
  if (val.length < 6 || val.length > 254) {
    return {
      valid: false,
      message: "Email must be between 6 and 254 characters",
    };
  }
  if (val.includes("..")) {
    return { valid: false, message: "Email cannot contain consecutive dots" };
  }
  const emailRegex =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
  if (!emailRegex.test(val)) {
    return {
      valid: false,
      message: "Please enter a valid email format (e.g. name@domain.com)",
    };
  }
  const parts = val.split("@");
  if (parts[0].length > 64) {
    return {
      valid: false,
      message: "Email username portion cannot exceed 64 characters",
    };
  }
  return { valid: true };
}

/**
 * Validates password strictly against complexity rules:
 * - Minimum 8 characters length
 * - At least 1 capital alphabet (A-Z)
 * - At least 1 numeric character (0-9)
 * - At least 1 special character (!@#$%^&* etc.)
 */
function validateStrictPassword(password) {
  if (!password) {
    return { valid: false, message: "Password is required" };
  }
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one capital alphabet (A-Z)",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one numeric character (0-9)",
    };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character",
    };
  }
  return { valid: true };
}

/* ==========================================================================
   1. PASSWORD SHOW / HIDE TOGGLE
   ========================================================================== */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll(".password-toggle-btn");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const wrap = btn.closest(".password-input-wrap");
      const input = wrap ? wrap.querySelector(".form-input") : null;
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>`;
      } else {
        input.type = "password";
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="10" r="3"/></svg>`;
      }
    });
  });
}

/* ==========================================================================
   2. PASSWORD STRENGTH METER (Real-Time)
   ========================================================================== */
function evaluatePasswordStrength(val) {
  const rules = {
    length: val.length >= 8,
    upper: /[A-Z]/.test(val),
    lower: /[a-z]/.test(val),
    number: /[0-9]/.test(val),
    special: /[^A-Za-z0-9]/.test(val),
  };

  let score = 0;
  if (rules.length) score++;
  if (rules.upper) score++;
  if (rules.lower) score++;
  if (rules.number) score++;
  if (rules.special) score++;

  return { rules, score };
}

function initPasswordStrengthMeter() {
  const pwdInput = document.getElementById("signup-password");
  const barFill = document.getElementById("strength-bar-fill");
  const strengthText = document.getElementById("strength-label-text");
  if (!pwdInput || !barFill) return;

  const ruleLength = document.getElementById("rule-length");
  const ruleUpper = document.getElementById("rule-upper");
  const ruleLower = document.getElementById("rule-lower");
  const ruleNumber = document.getElementById("rule-number");
  const ruleSpecial = document.getElementById("rule-special");

  pwdInput.addEventListener("input", () => {
    const val = pwdInput.value;
    const { rules, score } = evaluatePasswordStrength(val);

    const updateRule = (el, valid) => {
      if (!el) return;
      el.classList.toggle("valid", valid);
      const icon = el.querySelector("span");
      if (icon) icon.textContent = valid ? "✓" : "•";
    };

    updateRule(ruleLength, rules.length);
    updateRule(ruleUpper, rules.upper);
    updateRule(ruleLower, rules.lower);
    updateRule(ruleNumber, rules.number);
    updateRule(ruleSpecial, rules.special);

    if (val.length === 0) {
      barFill.style.width = "0%";
      barFill.style.backgroundColor = "transparent";
      if (strengthText) strengthText.textContent = "None";
    } else if (score <= 2) {
      barFill.style.width = "30%";
      barFill.style.backgroundColor = "#EF4444";
      if (strengthText) strengthText.textContent = "Weak";
    } else if (score === 3 || score === 4) {
      barFill.style.width = "70%";
      barFill.style.backgroundColor = "#F59E0B";
      if (strengthText) strengthText.textContent = "Moderate";
    } else {
      barFill.style.width = "100%";
      barFill.style.backgroundColor = "#10B981";
      if (strengthText) strengthText.textContent = "Strong & Secure";
    }
  });
}

/* ==========================================================================
   3. SIGN UP FORM CONTROLLER
   Condition: "Create account click action should do the following actions :
   Reset the form with success message displayed and then after 1 second it
   should get redirected to login page."
   ========================================================================== */
function initSignUpForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const terms = document.getElementById("signup-terms");

  const setError = (field, msg) => {
    const group = field.closest(".form-group");
    if (group) {
      group.classList.add("has-error");
      let errorEl = group.querySelector(".field-error-msg");
      if (!errorEl) {
        errorEl = document.createElement("span");
        errorEl.className = "field-error-msg";
        group.appendChild(errorEl);
      }
      errorEl.textContent = msg;
    }
    field.classList.add("is-invalid");
  };

  const clearError = (field) => {
    const group = field.closest(".form-group");
    if (group) {
      group.classList.remove("has-error");
      const errorEl = group.querySelector(".field-error-msg");
      if (errorEl) errorEl.textContent = "";
    }
    field.classList.remove("is-invalid");
  };

  // Live error clearing
  form
    .querySelectorAll(".form-input, .form-select, input[type='checkbox']")
    .forEach((inp) => {
      inp.addEventListener("input", () => clearError(inp));
      inp.addEventListener("change", () => clearError(inp));
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("signup-first-name");
    const lastName = document.getElementById("signup-last-name");
    const username = document.getElementById("signup-username");
    const email = document.getElementById("signup-email");
    const password = document.getElementById("signup-password");
    const confirmPassword = document.getElementById("signup-confirm-password");
    const role = document.getElementById("signup-role");
    const countryCode = document.getElementById("signup-country-code");
    const phone = document.getElementById("signup-phone");
    const address = document.getElementById("signup-address");

    let firstInvalidField = null;

    form
      .querySelectorAll(".form-input, .form-select, input[type='checkbox']")
      .forEach(clearError);

    // 1. Name fields: alphabetical characters only
    const alphaRegex = /^[A-Za-z\s]+$/;
    if (!firstName.value.trim()) {
      setError(firstName, "First name is required");
      if (!firstInvalidField) firstInvalidField = firstName;
    } else if (!alphaRegex.test(firstName.value.trim())) {
      setError(
        firstName,
        "Name field should allow only alphabetical characters"
      );
      if (!firstInvalidField) firstInvalidField = firstName;
    }

    if (!lastName.value.trim()) {
      setError(lastName, "Last name is required");
      if (!firstInvalidField) firstInvalidField = lastName;
    } else if (!alphaRegex.test(lastName.value.trim())) {
      setError(
        lastName,
        "Name field should allow only alphabetical characters"
      );
      if (!firstInvalidField) firstInvalidField = lastName;
    }

    // 2. Username
    const usernameRegex = /^[A-Za-z0-9_.-]+$/;
    if (!username.value.trim() || username.value.trim().length < 3) {
      setError(username, "Username must be at least 3 characters");
      if (!firstInvalidField) firstInvalidField = username;
    } else if (!usernameRegex.test(username.value.trim())) {
      setError(username, "Username can only contain letters, numbers, and .-_");
      if (!firstInvalidField) firstInvalidField = username;
    }

    // 3. Email: Strict format, length, and allowed characters
    const emailCheck = validateStrictEmail(email.value);
    if (!emailCheck.valid) {
      setError(email, emailCheck.message);
      if (!firstInvalidField) firstInvalidField = email;
    }

    // 4. Password: Min 8 chars, 1 special char, 1 numeric char, 1 capital alphabet at least
    const passwordCheck = validateStrictPassword(password.value);
    if (!passwordCheck.valid) {
      setError(password, passwordCheck.message);
      if (!firstInvalidField) firstInvalidField = password;
    }

    // 5. Password and confirm password should be same
    if (!confirmPassword.value) {
      setError(confirmPassword, "Please confirm your password");
      if (!firstInvalidField) firstInvalidField = confirmPassword;
    } else if (confirmPassword.value !== password.value) {
      setError(confirmPassword, "Password and confirm password should be same");
      if (!firstInvalidField) firstInvalidField = confirmPassword;
    }

    // 6. Role selection
    if (!role.value) {
      setError(role, "Please select your role");
      if (!firstInvalidField) firstInvalidField = role;
    }

    // 7. Mobile Number: numeric characters only
    const phoneRaw = phone.value.trim();
    const numericRegex = /^[0-9]+$/;
    if (!phoneRaw) {
      setError(phone, "Mobile number is required");
      if (!firstInvalidField) firstInvalidField = phone;
    } else if (!numericRegex.test(phoneRaw)) {
      setError(
        phone,
        "Mobile number field should allow only numeric characters"
      );
      if (!firstInvalidField) firstInvalidField = phone;
    } else if (phoneRaw.length < 7 || phoneRaw.length > 15) {
      setError(phone, "Mobile number must be between 7 and 15 digits");
      if (!firstInvalidField) firstInvalidField = phone;
    }

    // 8. Agree T&C checkbox is a mandatory field
    if (!terms.checked) {
      setError(terms, "You must agree to the Terms of Use and Privacy Policy");
      window.showToast(
        "You must agree to the Terms of Use and Privacy Policy.",
        "error"
      );
      if (!firstInvalidField) firstInvalidField = terms;
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    // Save registered user
    const newUser = {
      id: "usr-" + Date.now(),
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      username: username.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
      role: role.value,
      countryCode: countryCode ? countryCode.value : "+91",
      phone: phoneRaw,
      address: address ? address.value.trim() : "",
      createdAt: new Date().toISOString(),
    };

    window.StacklyStore.saveUser(newUser);

    // Upon all mandatory fields, sign up form should redirect to sign in page
    form.reset();
    window.showToast(
      "Account created successfully! Redirecting to sign in page...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "sign-in.html";
    }, 1000);
  });
}

/* ==========================================================================
   4. SIGN IN FORM CONTROLLER
   - Strict Email validation
   - Strict Password validation (min 8 chars, 1 special char, 1 numeric, 1 capital)
   ========================================================================== */
function initSignInForm() {
  const form = document.getElementById("signin-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signin-email");
    const password = document.getElementById("signin-password");
    const role = document.getElementById("signin-role");

    let firstInvalidField = null;

    const setError = (field, msg) => {
      const group = field.closest(".form-group");
      if (group) {
        group.classList.add("has-error");
        let errorEl = group.querySelector(".field-error-msg");
        if (!errorEl) {
          errorEl = document.createElement("span");
          errorEl.className = "field-error-msg";
          group.appendChild(errorEl);
        }
        errorEl.textContent = msg;
      }
      field.classList.add("is-invalid");
      if (!firstInvalidField) firstInvalidField = field;
    };

    const clearError = (field) => {
      const group = field.closest(".form-group");
      if (group) {
        group.classList.remove("has-error");
        const errorEl = group.querySelector(".field-error-msg");
        if (errorEl) errorEl.textContent = "";
      }
      field.classList.remove("is-invalid");
    };

    // Live error clearing
    form.querySelectorAll(".form-input, .form-select").forEach((inp) => {
      inp.addEventListener("input", () => clearError(inp));
      inp.addEventListener("change", () => clearError(inp));
    });

    form.querySelectorAll(".form-input, .form-select").forEach(clearError);

    // Validate email format strictly
    const emailVal = email.value.trim();
    const emailCheck = validateStrictEmail(emailVal);
    if (!emailCheck.valid) {
      setError(email, emailCheck.message);
    }

    // Validate password strictly (min 8 chars, 1 special char, 1 numeric, 1 capital alphabet)
    const passwordCheck = validateStrictPassword(password.value);
    if (!passwordCheck.valid) {
      setError(password, passwordCheck.message);
      if (!firstInvalidField) firstInvalidField = password;
    }

    // Role is a mandatory field in signin and signup page, as a part of form validation, select a role
    if (!role || !role.value) {
      setError(role, "Please select your role");
      if (!firstInvalidField) firstInvalidField = role;
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    // Check if user previously registered in stackly_users
    const users = window.StacklyStore.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === emailVal.toLowerCase()
    );

    const selectedRole = role.value;

    // Create session user (works universally with any valid email and password)
    const displayName = existing
      ? existing.firstName
      : emailVal.split("@")[0].charAt(0).toUpperCase() +
        emailVal.split("@")[0].slice(1);
    const sessionUser = {
      id: existing ? existing.id : "usr-" + Date.now(),
      username: existing ? existing.username : emailVal.split("@")[0],
      firstName: displayName,
      lastName: existing ? existing.lastName : "",
      email: emailVal.toLowerCase(),
      role: selectedRole,
      lastLogin: new Date().toLocaleString(),
    };

    window.StacklyStore.setCurrentUser(sessionUser);
    window.showToast(
      `Welcome, ${displayName}! Accessing your dashboard...`,
      "success"
    );

    // Upon all mandatory fields, sign in form should redirect to dashboard page
    setTimeout(() => {
      const targetRole = (selectedRole || "Buyer").toLowerCase();
      window.location.href = `dashboard-${targetRole}.html`;
    }, 600);
  });
}
