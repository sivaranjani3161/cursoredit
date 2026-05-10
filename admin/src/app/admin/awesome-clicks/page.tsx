import { redirect } from 'next/navigation';

/** FC / Awesome Clicks are managed under Gallery */
export default function AwesomeClicksRedirectPage() {
  redirect('/admin/gallery');
}
