// ===== SETTINGS =====
const SITE_PASSWORD = "1234";   // change password here only
const COOKIE_NAME = "site_auth";
const COOKIE_DAYS = 30;
// ====================

// Set a cookie
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  document.cookie = name + "=" + value + ";expires=" + d.toUTCString() + ";path=/";
}

// Get a cookie
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
  }
  return "";
}

// Check password
if (getCookie(COOKIE_NAME) !== "true") {
  if (prompt("Enter password:") === SITE_PASSWORD) {
    setCookie(COOKIE_NAME, "true", COOKIE_DAYS);
  } else {
    window.location.href = "/index.html";
  }
}
