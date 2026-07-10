import { type Metadata } from 'next'

export { TransformerEditPage as default } from '~/components/pages/transformers-detail'

type TransformerEditPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: TransformerEditPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `แก้ไขข้อมูลหม้อแปลง ${id}`,
    title: `แก้ไข ${id}`,
  }
}
