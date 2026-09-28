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
      if (group) group.classList.remove("has-error");
      field.classList.remove("is-invalid");
    };

    form.querySelectorAll(".form-input, .form-select").forEach(clearError);

    // Validations
    if (!firstName.value.trim()) {
      setError(firstName, "First name is required");
    }
    if (!lastName.value.trim()) {
      setError(lastName, "Last name is required");
    }
    if (!username.value.trim() || username.value.trim().length < 3) {
      setError(username, "Username must be at least 3 characters");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      setError(email, "Please provide a valid email format");
    }

    const { score } = evaluatePasswordStrength(password.value);
    if (!password.value || score < 3) {
      setError(
        password,
        "Password must have min 8 chars with mixed case, numbers & special character"
      );
    }

    if (!confirmPassword.value || confirmPassword.value !== password.value) {
      setError(confirmPassword, "Passwords do not match");
    }

    if (!role.value) {
      setError(role, "Please select your role");
    }

    const phoneVal = phone.value.replace(/[^0-9]/g, "");
    if (!phoneVal || phoneVal.length < 8) {
      setError(phone, "Please enter a valid numeric phone number");
    }

    if (!terms.checked) {
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
      phone: phoneVal,
      address: address ? address.value.trim() : "",
      createdAt: new Date().toISOString(),
    };

    window.StacklyStore.saveUser(newUser);

    // Exact user requirement: Reset form with success message displayed and after 1 second redirect to login page
    form.reset();
    window.showToast(
      "Account created successfully! Redirecting to login...",
      "success"
    );

    setTimeout(() => {
      window.location.href = "sign-in.html";
    }, 1000);
  });
}

/* ==========================================================================
   4. SIGN IN FORM CONTROLLER
   Condition: "Remove all the demo credentials and make sure sign-in should
   work with any proper valid email id and password."
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailVal = email.value.trim();
    if (!emailVal) {
      setError(email, "Email address is required");
    } else if (!emailRegex.test(emailVal)) {
      setError(
        email,
        "Please enter a valid email format (e.g. name@domain.com)"
      );
    }

    // Validate password (non-empty, min 4-6 chars)
    if (!password.value) {
      setError(password, "Password is required");
    } else if (password.value.length < 4) {
      setError(password, "Password must be at least 4 characters");
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

    const selectedRole =
      role && role.value ? role.value : existing ? existing.role : "Buyer";

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

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 600);
  });
}
