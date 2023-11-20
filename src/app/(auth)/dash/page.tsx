import { Card } from 'components/card';
import { monthlyDetails } from 'mocks/data-home';
import { TrafficGraphic } from './traffic-chart';
import { PieChart } from './pie-chart';
import { Docs } from './docs';
import { DeviceChart } from './device-chart';

const Dash = () => {
  return (
    <div className="px-8 py-10">
      <section className="w-full grid grid-cols-4 gap-2 xl:gap-6">
        {monthlyDetails.map((item, i) => (
          <Card key={item.id} index={i} {...item} />
        ))}
      </section>
      <div className="grid grid-cols-[25rem_1fr_25rem] gap-4 mt-8 flex-wrap">
        <TrafficGraphic />
        <PieChart />
        <Docs />
        <DeviceChart />
      </div>
    </div>
  );
};

export default Dash;
