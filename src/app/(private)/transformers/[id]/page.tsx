import { type Metadata } from 'next'

import { TransformerDetailPage } from '~/components/pages/transformers-detail'

type TransformerDetailPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: TransformerDetailPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `รายละเอียดหม้อแปลง ${id}`,
    title: id,
  }
}

export default function TransformerPage() {
  return <TransformerDetailPage />
}
