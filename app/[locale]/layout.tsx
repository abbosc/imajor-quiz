import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales, Locale } from '@/i18n/config';

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const messages = await getMessages();
  const metadata = messages.metadata as { title: string; description: string } | undefined;

  const baseUrl = 'https://imajor.app';

  return {
    title: metadata?.title || "iMajor - Discover Your Perfect College Major",
    description: metadata?.description || "Take the free Major Exploration Quiz to discover how deeply you've explored your college major options.",
    openGraph: {
      locale: locale === 'en' ? 'en_US' : locale === 'ru' ? 'ru_RU' : 'uz_UZ',
      url: `${baseUrl}/${locale}`,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'uz': `${baseUrl}/uz`,
        'ru': `${baseUrl}/ru`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params: { locale } }: Props) {
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
