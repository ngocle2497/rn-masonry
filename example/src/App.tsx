import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import RnMasonry from 'rn-masonry-list';
const data = [
  {
    uri:
      'https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/publications/food-beverage-nutrition/foodnavigator.com/article/2020/04/22/coronavirus-and-obesity-doctors-take-aim-at-food-industry-over-poor-diets/10933380-3-eng-GB/Coronavirus-and-obesity-Doctors-take-aim-at-food-industry-over-poor-diets_wrbm_large.jpg',
  },
  {
    uri:
      'https://i.insider.com/5c0192d1de34c43da26049d4?width=1100&format=jpeg&auto=webp',
  },
  {
    uri:
      'https://stmedia.stimg.co/ctyp-nordic-state-fair-new.jpg?w=800',
  },
  {
    uri:
      'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/great_food_combos_for_losing_weight_slideshow/650x350_great_food_combos_for_losing_weight_slideshow.jpg',
  },
  {
    uri:
      'https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/slideshows/great_food_combos_for_losing_weight_slideshow/650x350_great_food_combos_for_losing_weight_slideshow.jpg',
  },
]
export default function App() {
  return (
    <View style={styles.container}>
      <RnMasonry data={data} columns={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
