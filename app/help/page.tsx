import { HelpCircle, FileQuestion, Phone, MessageSquare } from 'lucide-react';
import Layout from '@/components/Layout';

const faqs = [
  { q: 'Who is eligible to vote?', a: 'Every Indian citizen who has attained the age of 18 years on the qualifying date is eligible to be registered as a voter.' },
  { q: 'What is an EPIC number?', a: 'EPIC stands for Electors Photo Identity Card. It is a unique identification number assigned to every registered voter.' },
  { q: 'How does digital voting work?', a: 'After identity verification through facial recognition, voters can cast their vote digitally. The vote is encrypted and securely recorded on the blockchain.' },
  { q: 'Can I change my vote after submission?', a: 'No. Once a vote is submitted and confirmed, it cannot be changed or revoked. Please review your selection carefully before confirming.' },
  { q: 'How do I report an issue?', a: 'You can submit a complaint through the Help Center or call the toll-free helpline at 1800-111-950.' },
];

const guides = [
  { title: 'How to Vote', icon: HelpCircle, content: 'Step 1: Register with your EPIC number. Step 2: Verify your identity via facial recognition. Step 3: Select your candidate. Step 4: Confirm and submit your vote.' },
  { title: 'Voter Eligibility', icon: FileQuestion, content: 'You must be an Indian citizen, aged 18 or above, with a valid EPIC card. You must be registered in the electoral roll of your constituency.' },
  { title: 'Submit a Complaint', icon: MessageSquare, content: 'Visit the nearest election office or call 1800-111-950. Online complaints can be submitted through the National Grievance Portal.' },
  { title: 'Contact Support', icon: Phone, content: 'Toll Free: 1800-111-950 | Email: support@bharatvote.gov.in | Office: Nirvachan Sadan, Ashoka Road, New Delhi - 110001' },
];

export default function HelpCenter() {
  return (
    <Layout>
      <div className="govt-section">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold mb-2">Help Center</h1>
          <p className="text-muted-foreground mb-8">Everything you need to know about voting</p>

          {/* Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {guides.map(g => (
              <div key={g.title} className="govt-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <g.icon className="h-6 w-6 text-primary" />
                  <h3 className="font-heading font-semibold">{g.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{g.content}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3 max-w-2xl">
            {faqs.map(f => (
              <details key={f.q} className="govt-card p-4 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
