
import { DatabaseCollege } from '../collegeDatabase';

const API_KEY = import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY;
const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools.json';

export async function searchColleges(query: string): Promise<DatabaseCollege[]> {
  if (!API_KEY) {
    console.warn('College Scorecard API key missing. Falling back to local database.');
    return [];
  }

  try {
    const params = new URLSearchParams({
      api_key: API_KEY,
      'school.name': query,
      fields: 'school.name,school.city,school.state,school.institutional_characteristics.level',
      per_page: '10',
      sort: 'school.name'
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch from College Scorecard API');

    const data = await response.json();
    
    return data.results.map((item: any) => {
      // Map level to a readable string or division if possible
      // Level 1: 4-year, Level 2: 2-year, Level 3: Less than 2-year
      const level = item['school.institutional_characteristics.level'];
      let division = 'Other';
      if (level === 1) division = 'NCAA D1/D2/D3 (4-Year)';
      if (level === 2) division = 'NJCAA/CCCAA (2-Year)';

      return {
        name: item['school.name'],
        division: division,
        location: `${item['school.city']}, ${item['school.state']}`
      };
    });
  } catch (error) {
    console.error('Error searching colleges:', error);
    return [];
  }
}
