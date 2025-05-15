
export const parseCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== 'string') {
        console.log("Failed to read file or result is not a string");
        resolve([]);
        return;
      }
      
      const csvData = event.target.result;
      console.log("CSV data length:", csvData.length);
      
      // Split by line breaks, handling different OS formats
      const lines = csvData.split(/\r\n|\n|\r/).filter(line => line.trim() !== '');
      
      if (lines.length <= 1) {
        console.log("CSV has no data rows, only headers or empty");
        resolve([]);
        return;
      }
      
      console.log("Number of lines in CSV:", lines.length);
      console.log("Headers:", lines[0]);
      
      // Parse headers - handle both comma and tab delimiters
      const delimiter = lines[0].includes('\t') ? '\t' : ',';
      const headers = lines[0].split(delimiter).map(header => header.trim());
      console.log("Parsed headers:", headers);
      
      const result = [];
      
      // Start from line 1 (after header)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;
        
        // Handle quoted values correctly
        let inQuote = false;
        let currentValue = '';
        const values = [];
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          
          if (char === '"' && (j === 0 || line[j-1] !== '\\')) {
            inQuote = !inQuote;
          } else if (char === delimiter && !inQuote) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        
        // Add the last value
        values.push(currentValue.trim());
        
        // Create object from headers and values
        if (values.length === headers.length) {
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            // Remove any surrounding quotes
            let value = values[index];
            if (value && value.startsWith('"') && value.endsWith('"')) {
              value = value.substring(1, value.length - 1);
            }
            obj[header] = value;
          });
          result.push(obj);
        } else {
          console.log(`Line ${i} has ${values.length} values but ${headers.length} headers. Skipping.`);
          console.log("Values:", values);
        }
      }
      
      console.log("Parsed result count:", result.length);
      if (result.length > 0) {
        console.log("First parsed row:", result[0]);
      }
      
      resolve(result);
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      resolve([]);
    };
    
    reader.readAsText(file);
  });
};
