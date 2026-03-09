export interface Election {
  id: string;
  election_type: string;
  state: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'upcoming' | 'completed';
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  party_symbol: string;
  election_id: string;
  votes: number;
  photo: string;
}

export interface Booth {
  id: string;
  booth_number: string;
  address: string;
  constituency: string;
  district: string;
  state: string;
  officer: string;
  lat: number;
  lng: number;
}

export interface ElectionDocument {
  id: string;
  title: string;
  category: string;
  date: string;
  file_url: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
}

export const elections: Election[] = [
  { id: '1', election_type: 'Lok Sabha Election', state: 'All India', start_date: '2026-04-10', end_date: '2026-05-20', status: 'upcoming' },
  { id: '2', election_type: 'State Assembly Election', state: 'Maharashtra', start_date: '2026-03-01', end_date: '2026-03-15', status: 'active' },
  { id: '3', election_type: 'Municipal Corporation Election', state: 'Delhi', start_date: '2026-03-05', end_date: '2026-03-10', status: 'active' },
  { id: '4', election_type: 'Nagar Panchayat Election', state: 'Uttar Pradesh', start_date: '2026-02-01', end_date: '2026-02-15', status: 'completed' },
  { id: '5', election_type: 'Mayor Election', state: 'Karnataka', start_date: '2026-03-20', end_date: '2026-03-20', status: 'upcoming' },
  { id: '6', election_type: 'Ward Election', state: 'Tamil Nadu', start_date: '2026-02-20', end_date: '2026-02-25', status: 'completed' },
];

export const candidates: Candidate[] = [
  { id: '1', name: 'Rajesh Kumar', party: 'National Democratic Alliance', party_symbol: '🪷', election_id: '2', votes: 45230, photo: '' },
  { id: '2', name: 'Priya Sharma', party: 'United Progressive Front', party_symbol: '✋', election_id: '2', votes: 38920, photo: '' },
  { id: '3', name: 'Amit Patel', party: "People's Democratic Party", party_symbol: '🌾', election_id: '2', votes: 12450, photo: '' },
  { id: '4', name: 'Sunita Devi', party: 'Independent', party_symbol: '⭐', election_id: '2', votes: 8700, photo: '' },
  { id: '5', name: 'Vikram Singh', party: 'National Democratic Alliance', party_symbol: '🪷', election_id: '3', votes: 32100, photo: '' },
  { id: '6', name: 'Meera Nair', party: 'United Progressive Front', party_symbol: '✋', election_id: '3', votes: 29800, photo: '' },
];

export const booths: Booth[] = [
  { id: '1', booth_number: 'MH-001', address: 'Government School, Andheri West', constituency: 'Mumbai North', district: 'Mumbai', state: 'Maharashtra', officer: 'Mr. R.K. Verma', lat: 19.1364, lng: 72.8296 },
  { id: '2', booth_number: 'MH-002', address: 'Community Hall, Bandra East', constituency: 'Mumbai South', district: 'Mumbai', state: 'Maharashtra', officer: 'Mrs. S. Patil', lat: 19.0596, lng: 72.8411 },
  { id: '3', booth_number: 'DL-001', address: 'Primary School, Connaught Place', constituency: 'New Delhi', district: 'Central Delhi', state: 'Delhi', officer: 'Mr. A. Kumar', lat: 28.6315, lng: 77.2167 },
];

export const documents: ElectionDocument[] = [
  { id: '1', title: 'General Election Notification 2026', category: 'Election Notifications', date: '2026-02-15', file_url: '#' },
  { id: '2', title: 'Candidate List — Maharashtra Assembly', category: 'Candidate Lists', date: '2026-02-20', file_url: '#' },
  { id: '3', title: 'Model Code of Conduct Guidelines', category: 'Election Rules', date: '2026-01-10', file_url: '#' },
  { id: '4', title: 'Rejected Nominations — Delhi Municipal', category: 'Rejected Candidates', date: '2026-02-25', file_url: '#' },
  { id: '5', title: 'Voter Roll Revision Notice', category: 'Voter Removal Notices', date: '2026-01-20', file_url: '#' },
  { id: '6', title: 'EVM Usage Guidelines', category: 'Public Announcements', date: '2026-02-01', file_url: '#' },
];

export const announcements: Announcement[] = [
  { id: '1', title: 'Maharashtra Assembly Election Schedule Released', date: '2026-02-15', content: 'The Election Commission has announced the schedule for Maharashtra State Assembly Elections.' },
  { id: '2', title: 'Voter ID Verification Deadline Extended', date: '2026-02-20', content: 'Last date for voter ID verification has been extended to March 5, 2026.' },
  { id: '3', title: 'New Digital Voting Guidelines Published', date: '2026-02-25', content: 'Updated guidelines for digital voting procedures have been published.' },
  { id: '4', title: 'Polling Booth Accessibility Improvements', date: '2026-03-01', content: 'All polling booths will now have wheelchair access and braille signage.' },
];

export const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export type AdminRole = 'super' | 'ec' | 'state' | 'district' | 'constituency' | 'booth' | 'staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export const mockAdmin: AdminUser = {
  id: '1',
  name: 'Chief Election Commissioner',
  email: 'admin@bharatvote.gov.in',
  role: 'super',
};
