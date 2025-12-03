import { UserProfile, AgentLevel } from '../types';

// Your Specific Sheet ID
const SPREADSHEET_ID = '1xVss7MMf8MIipCH0pUGqgvb6H89FK8_SzAYOJb3xWdk';

export const authenticateUser = async (email: string): Promise<UserProfile | null> => {
  try {
    // We use the Google Visualization API endpoint (gviz) to export as CSV.
    // This requires the sheet to be shared as "Anyone with the link can view".
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Failed to connect to Roster Sheet. Status: ${response.status}`);
    }

    const text = await response.text();
    
    // Parse CSV text to array of arrays
    // This handles the specific format Google returns (quoted strings)
    const rows = text.split('\n').map(line => {
        const row: string[] = [];
        let inQuote = false;
        let currentVal = '';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                row.push(currentVal);
                currentVal = '';
            } else {
                currentVal += char;
            }
        }
        row.push(currentVal); // push last value
        
        // Clean up quotes from individual values
        return row.map(val => val.trim().replace(/^"|"$/g, ''));
    });

    // Find the user (Case insensitive)
    // Sheet Column Structure: [A: Mail ID, B: Joining date, C: User ID]
    const userRow = rows.find((row: string[]) => 
      row[0] && row[0].trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!userRow) {
      console.warn(`Access Attempt: ${email} not found in live roster.`);
      return null; 
    }

    // Process User Data found in the sheet
    const joinDateStr = userRow[1];
    let joinDate = new Date(joinDateStr);
    
    // Robust Date Parsing for various formats (e.g., DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
    if (isNaN(joinDate.getTime())) {
        // Attempt to parse manually if standard parser fails
        // Common issue: Sheets exporting as DD/MM/YYYY
        if (joinDateStr.includes('/')) {
            const parts = joinDateStr.split('/');
            // Try assuming DD/MM/YYYY
            if (parts.length === 3) {
               const day = parseInt(parts[0], 10);
               const month = parseInt(parts[1], 10) - 1; 
               const year = parseInt(parts[2], 10);
               const tentativeDate = new Date(year, month, day);
               if (!isNaN(tentativeDate.getTime())) {
                   joinDate = tentativeDate;
               } else {
                   joinDate = new Date(); // Fallback to now
               }
            }
        } else {
            console.warn(`Invalid date format for ${email}: ${joinDateStr}. Defaulting to today.`);
            joinDate = new Date(); 
        }
    }

    // Calculate Tenure based on Joining Date
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); 

    // Assign Agent Level
    let level: AgentLevel = 'Rookie';
    if (diffMonths > 24) {
      level = 'Expert';
    } else if (diffMonths > 6) {
      level = 'Associate';
    }

    return {
      email: userRow[0],
      joinDate: joinDate,
      tenureMonths: diffMonths,
      level: level
    };

  } catch (error) {
    console.error("Authentication Error:", error);
    // Important: We return NULL here to deny access if the sheet cannot be reached.
    // This strictly enforces the "Database" requirement.
    throw new Error("Could not verify credentials against the HR Database.");
  }
};