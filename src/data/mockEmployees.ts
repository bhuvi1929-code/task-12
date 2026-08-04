import type { Department, Employee, EmployeeStatus, Location, RiskLevel, RoleName } from '../types';

// Simple seeded PRNG (mulberry32) so the dataset is stable across renders/tests.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

const departments: Department[] = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const roles: RoleName[] = ['Manager', 'Developer', 'Designer', 'Analyst', 'Recruiter', 'Executive'];
const locations: Location[] = ['New York', 'London', 'Remote', 'Bengaluru', 'Berlin'];
const statuses: EmployeeStatus[] = ['active', 'active', 'active', 'active', 'on-leave', 'terminated'];
const risks: RiskLevel[] = ['low', 'low', 'low', 'medium', 'medium', 'high'];

const firstNames = [
  'Aarav', 'Priya', 'James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Rohan', 'Sofia',
  'Ethan', 'Mia', 'Lucas', 'Isabella', 'Mason', 'Zara', 'Arjun', 'Grace', 'Daniel', 'Chloe',
  'Kabir', 'Anaya', 'William', 'Amelia', 'Ben', 'Nora', 'Ishaan', 'Layla', 'Leo', 'Ruby',
];
const lastNames = [
  'Sharma', 'Patel', 'Smith', 'Johnson', 'Williams', 'Brown', 'Gupta', 'Kumar', 'Davis',
  'Miller', 'Wilson', 'Anderson', 'Nair', 'Reddy', 'Fischer', 'Schmidt', 'Clark', 'Taylor',
  'Roy', 'Verma',
];

const availableSkills = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Figma', 'AWS', 'Docker', 'Kubernetes',
  'SQL', 'MongoDB', 'GraphQL', 'Machine Learning', 'Data Analysis', 'Project Management',
  'Agile', 'Communication', 'Leadership', 'Salesforce', 'SEO', 'Content Creation'
];

function pickMultiple<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - rand());
  return shuffled.slice(0, count);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomDateWithinMonths(monthsBack: number): Date {
  const now = new Date('2026-07-24T00:00:00Z');
  const past = new Date(now);
  past.setMonth(past.getMonth() - monthsBack);
  const t = past.getTime() + rand() * (now.getTime() - past.getTime());
  return new Date(t);
}

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];

  for (let i = 0; i < count; i++) {
    const first = pick(firstNames);
    const last = pick(lastNames);
    const department = pick(departments);
    const role = pick(roles);
    const location = pick(locations);
    const status = pick(statuses);
    const riskLevel = pick(risks);
    const hireDate = randomDateWithinMonths(30); // hired within last ~2.5 years
    const terminationDate = status === 'terminated' ? randomDateWithinMonths(6).toISOString() : null;

    employees.push({
      id: `EMP-${String(i + 1).padStart(5, '0')}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@thestackly.com`,
      department,
      role,
      location,
      status,
      riskLevel,
      hireDate: hireDate.toISOString(),
      terminationDate,
      performanceScore: Math.round(55 + rand() * 45),
      trainingCompletion: Math.round(40 + rand() * 60),
      salary: Math.round((45000 + rand() * 95000) / 1000) * 1000,
      managerId: i > 20 ? `EMP-${String(1 + Math.floor(rand() * 20)).padStart(5, '0')}` : null,
      skills: pickMultiple(availableSkills, Math.floor(rand() * 5) + 1), // 1 to 5 skills
      experienceYears: Math.floor(rand() * 15) + 1, // 1 to 15 years
    });
  }

  return employees;
}

export const mockEmployees: Employee[] = generateEmployees(10000);
