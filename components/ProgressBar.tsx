export default function ProgressBar({ value }:{ value:number }){
  const v = Math.max(0, Math.min(100, Math.round(value)))
  return (<div className="progress"><span style={{ width: `${v}%` }} /></div>)
}
