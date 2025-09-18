import { Metadata } from '@redwoodjs/web'
import { useParams } from '@redwoodjs/router'
import CollectionBySlugCell from 'src/components/CollectionBySlugCell'

const CollectionPage = () => {
  const { slug } = useParams()
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Metadata title={`Collection - ${slug}`} description={`Products in collection ${slug}`} />
      <CollectionBySlugCell slug={slug} />
    </div>
  )
}

export default CollectionPage
