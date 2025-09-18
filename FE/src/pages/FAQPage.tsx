import Header from "../shared/components/layout/Header";
import Footer from "../shared/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../shared/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">FAQ</h1>
          <p className="text-gray-600 mb-8">Answers to common questions about Storybook4me.</p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Storybook4me and how does it work?</AccordionTrigger>
              <AccordionContent>
                Storybook4me turns your child into the hero of a personalized storybook. Just upload a photo and describe a story idea, and our system generates a magical book in about 10 seconds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Is my child’s photo and data safe?</AccordionTrigger>
              <AccordionContent>
                Yes. Your personal data and photos are handled securely and deleted immediately after your storybook is created. We only use them to generate your story and do not store them.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How long does it take to create a storybook?</AccordionTrigger>
              <AccordionContent>
                It typically takes around 10 seconds from upload to preview. You’ll see a progress indicator while the magic happens.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Can I customize the story and characters?</AccordionTrigger>
              <AccordionContent>
                Yes. You can guide the story with your own prompt, choose themes (adventure, memories, overcoming fears), and personalize details so your child truly becomes the hero.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;