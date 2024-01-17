import NoSSRWrapper from '@/components/util/NoSSRWrapper'
import Home from '@/components/Home'

export default function Page() {
  return (
    <NoSSRWrapper>
      <Home />
    </NoSSRWrapper>
  )
}
