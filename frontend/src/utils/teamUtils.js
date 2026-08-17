export const getTeamLogo = (team) => {
  if (!team) return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
  if (team.logo_url && typeof team.logo_url === 'string' && team.logo_url.trim()) {
    return team.logo_url.trim();
  }
  
  const name = (team.name || '').toLowerCase();
  const s = (team.short_name || team.code || '').toUpperCase();
  
  if (s === 'CVFC' || name.includes('clubverse')) {
    return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
  }
  if (s === 'MCY' || s === 'MCFC' || s === 'MCI' || name.includes('manchester city')) {
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=80';
  }
  if (s === 'RMA' || name.includes('real madrid')) {
    return 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=200&auto=format&fit=crop&q=80';
  }
  if (s === 'BAR' || s === 'FCB' || name.includes('barcelona')) {
    return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=80';
  }
  if (s === 'ARS' || name.includes('arsenal')) {
    return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=200&auto=format&fit=crop&q=80';
};

/**
 * Formats time string (e.g. "20:00 GMT", "17:30", "08:00") into 12-hour format with AM/PM (e.g. "8:00 PM GMT", "5:30 PM GMT")
 */
export const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  const s = String(timeStr).trim();
  
  // If already contains AM or PM, return formatted
  if (/AM|PM/i.test(s)) return s;

  // Extract HH:MM and optional suffix e.g. "20:00 GMT" -> "20", "00", "GMT"
  const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(.*)$/);
  if (!match) return s;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const tz = match[3] ? ` ${match[3]}` : '';

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes} ${period}${tz}`;
};

/**
 * Parses match_date and match_time into a JavaScript Date object representing kickoff time
 */
export const parseMatchDateTime = (match_date, match_time) => {
  if (!match_date) return null;
  const d = new Date(match_date);
  if (isNaN(d.getTime())) return null;

  let hours = 12;
  let minutes = 0;

  if (match_time) {
    const timeStr = String(match_time).trim();
    const twelveHrMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (twelveHrMatch) {
      let h = parseInt(twelveHrMatch[1], 10);
      const m = twelveHrMatch[2] ? parseInt(twelveHrMatch[2], 10) : 0;
      const period = twelveHrMatch[3].toUpperCase();
      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      hours = h;
      minutes = m;
    } else {
      const twentyFourMatch = timeStr.match(/^(\d{1,2}):(\d{2})/);
      if (twentyFourMatch) {
        hours = parseInt(twentyFourMatch[1], 10);
        minutes = parseInt(twentyFourMatch[2], 10);
      }
    }
  }

  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes, 0, 0);
};

/**
 * Determines whether seat booking is open for a fixture.
 * Rule: Ticket booking closes 2 hours before match kickoff.
 */
export const getBookingStatus = (match_date, match_time, status) => {
  if (status === 'Completed' || status === 'Live') {
    return { open: false, reason: status === 'Completed' ? 'Match Completed' : 'Match Live' };
  }

  const kickoff = parseMatchDateTime(match_date, match_time);
  if (!kickoff) return { open: true, reason: '' };

  const now = new Date();
  const diffMs = kickoff.getTime() - now.getTime();
  const twoHoursMs = 2 * 60 * 60 * 1000; // 2 hours

  if (diffMs <= 0) {
    return { open: false, reason: 'Match Started / Past' };
  }
  if (diffMs < twoHoursMs) {
    const minutesLeft = Math.max(0, Math.floor(diffMs / (60 * 1000)));
    return { 
      open: false, 
      reason: `Booking Closed (Within 2 hrs of kickoff — ${minutesLeft} mins to start)` 
    };
  }

  return { open: true, reason: '' };
};

/**
 * Checks if match date is strictly in the past
 */
export const isPastFixture = (match_date, match_time) => {
  const kickoff = parseMatchDateTime(match_date, match_time);
  if (!kickoff) return false;
  const now = new Date();
  return kickoff.getTime() < now.getTime();
};
