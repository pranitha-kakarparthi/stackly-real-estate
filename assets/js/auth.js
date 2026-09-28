/* ==========================================================================
   STACKLY REAL ESTATE - AUTHENTICATION CONTROLLER (auth.js)
   Strict Frontend Auth: Real-time validation, Password Strength, Session Persistence
   Strictly Zero Pre-Seeded Demo Accounts (Users register & sign in)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initPasswordToggles();
  initPasswordStrengthMeter();
  initSignUpForm();
  initSignInForm();
});

/* ==========================================================================
   1. PASSWORD SHOW / HIDE TOGGLE
   ========================================================================== */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll(".password-toggle-btn");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".password-input-wrap");
      const input = wrap ? wrap.querySelector(".form-input") : null;
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>`;
      } else {
        input.type = "password";
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      }
    });
  });
}

/* ==========================================================================
   2. PASSWORD STRENGTH METER (Real-Time)
   Requirements: Uppercase, Lowercase, Number, Special Char, Min 8 chars
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

    // Update checklist UI
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

    // Progress bar width & color
    if (val.length === 0) {
      barFill.style.width = "0%";
      barFill.style.backgroundColor = "transparent";
      if (strengthText) strengthText.textContent = "None";
    } else if (score <= 2) {
      barFill.style.width = "25%";
      barFill.style.backgroundColor = "#EF4444"; // Red
      if (strengthText) strengthText.textContent = "Weak";
    } else if (score === 3 || score === 4) {
      barFill.style.width = "70%";
      barFill.style.backgroundColor = "#F59E0B"; // Amber
      if (strengthText) strengthText.textContent = "Moderate";
    } else {
      barFill.style.width = "100%";
      barFill.style.backgroundColor = "#10B981"; // Green
      if (strengthText) strengthText.textContent = "Strong & Secure";
    }
  });
}

/* ==========================================================================
   3. SIGN UP FORM CONTROLLER
   ========================================================================== */
function initSignUpForm() {
  const form = document.getElementById("signup-form");
  if (!form) return;

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
    const terms = document.getElementById("signup-terms");

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
      }
      field.classList.remove("is-invalid");
    };

    // Reset previous errors
    form.querySelectorAll(".form-input, .form-select").forEach(clearError);

    // Validate First Name
    if (!firstName.value.trim()) {
      setError(firstName, "First name is required");
    }

    // Validate Last Name
    if (!lastName.value.trim()) {
      setError(lastName, "Last name is required");
    }

    // Validate Username
    const existingUsers = window.StacklyStore.getUsers();
    if (!username.value.trim()) {
      setError(username, "Username is required");
    } else if (username.value.trim().length < 3) {
      setError(username, "Username must be at least 3 characters");
    } else if (
      existingUsers.some(
        (u) => u.username.toLowerCase() === username.value.trim().toLowerCase()
      )
    ) {
      setError(
        username,
        "This username is already taken. Please choose another."
      );
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      setError(email, "Email address is required");
    } else if (!emailRegex.test(email.value.trim())) {
      setError(email, "Please provide a valid email format");
    } else if (
      existingUsers.some(
        (u) => u.email.toLowerCase() === email.value.trim().toLowerCase()
      )
    ) {
      setError(
        email,
        "An account with this email already exists. Please sign in."
      );
    }

    // Validate Password
    const { score } = evaluatePasswordStrength(password.value);
    if (!password.value) {
      setError(password, "Password is required");
    } else if (score < 4) {
      setError(
        password,
        "Password does not meet the security criteria. Please satisfy all checklist items."
      );
    }

    // Validate Confirm Password
    if (!confirmPassword.value) {
      setError(confirmPassword, "Please confirm your password");
    } else if (confirmPassword.value !== password.value) {
      setError(confirmPassword, "Passwords do not match");
    }

    // Validate Role
    if (!role.value) {
      setError(role, "Please select your role");
    }

    // Validate Phone Number
    const phoneVal = phone.value.replace(/[^0-9]/g, "");
    if (!phoneVal) {
      setError(phone, "Mobile number is required");
    } else if (phoneVal.length < 8 || phoneVal.length > 15) {
      setError(
        phone,
        "Please enter a valid numeric phone number (8-15 digits)"
      );
    }

    // Validate Address (minimum characters)
    if (address && address.value.trim() && address.value.trim().length < 5) {
      setError(address, "Address must be at least 5 characters");
    }

    // Validate Terms Checkbox
    if (!terms.checked) {
      window.showToast(
        "You must agree to the Terms of Use and Privacy Policy.",
        "error"
      );
      if (!firstInvalidField) firstInvalidField = terms;
    }

    // Auto-focus first invalid field
    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    // Create New User Object
    const newUser = {
      id: "usr-" + Date.now(),
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      username: username.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value, // simulated secure client storage
      role: role.value,
      countryCode: countryCode.value,
      phone: phoneVal,
      address: address ? address.value.trim() : "",
      createdAt: new Date().toISOString(),
    };

    window.StacklyStore.saveUser(newUser);

    window.showToast(
      "Account registered successfully! Redirecting to Sign In...",
      "success"
    );
    form.reset();

    setTimeout(() => {
      window.location.href = "sign-in.html";
    }, 1200);
  });
}

/* ==========================================================================
   4. SIGN IN FORM CONTROLLER
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
      if (group) group.classList.remove("has-error");
      field.classList.remove("is-invalid");
    };

    form.querySelectorAll(".form-input, .form-select").forEach(clearError);

    // Basic Validation
    if (!email.value.trim()) {
      setError(email, "Email address is required");
    }
    if (!password.value) {
      setError(password, "Password is required");
    }
    if (!role.value) {
      setError(role, "Please select your role");
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    // Lookup user in localStorage
    const users = window.StacklyStore.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.value.trim().toLowerCase()
    );

    if (!user) {
      setError(
        email,
        "No account found with this email. Please register on the Sign Up page first."
      );
      firstInvalidField = email;
      email.focus();
      return;
    }

    if (user.password !== password.value) {
      setError(password, "Incorrect password. Please verify your credentials.");
      firstInvalidField = password;
      password.focus();
      return;
    }

    // Create session
    const sessionUser = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: role.value, // User can log in with selected active role
      avatar: user.avatar || "",
      lastLogin: new Date().toLocaleString(),
    };

    window.StacklyStore.setCurrentUser(sessionUser);
    window.showToast(
      `Welcome back, ${user.firstName}! Accessing dashboard...`,
      "success"
    );

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 800);
  });
}
