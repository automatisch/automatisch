import AppFlowRow from 'components/AppFlowRow';

type AppFlowsProps = {
  appKey: String;
}

export default function AppFlows(props: AppFlowsProps) {
  return (
    <>
      {Array.from(new Array(3)).map((item: any, index: number) => (
        <AppFlowRow key={index} flow={item} />
      ))}
    </>
  )
};
