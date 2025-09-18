import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { Input } from "../shared/components/ui/input";
import { Textarea } from "../shared/components/ui/textarea";
import { Button } from "../shared/components/ui/button";
import { Label } from "../shared/components/ui/label";
import { useState } from "react";
import { useToast } from "../shared/components/ui/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend endpoint if available
    toast({ title: "Submitted", description: "Thanks! We will get back to you shortly." });
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-10">Have a question or feedback? Send us a message and we’ll respond soon.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="jane@example.com" value={form.email} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" placeholder="Tell us how we can help…" className="min-h-[140px]" value={form.message} onChange={handleChange} required />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="magic-gradient text-white px-6">Submit</Button>
            </div>

            <div className="flex justify-end">
              <Button variant="link" type="button" asChild>
                <p><a href="mailto:hello@storybook4.me" className="text-magic-600">Or email us</a></p>
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;