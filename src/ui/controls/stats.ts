import { PlayerCurrencyContext } from '../../context/currency.ts';
import { LivesNotifier } from '../../context/lives.ts';
import { Views } from '../views.ts';

const formatCurrency = (currency: number) => {
    return currency.toLocaleString('en-US');
}

const registerCurrencyView = () => {
    const currencyDisplay = Views.currency;
    PlayerCurrencyContext.drive(currency => {
        currencyDisplay.textContent = `💰 ${formatCurrency(currency)}`;
    });
}

const registerLivesView = () => {
    const livesDisplay = Views.lives;
    LivesNotifier.drive(lives => {
        const hours = Math.floor(lives / 60);
        const minutes = lives % 60;

        const hoursDisplay = hours > 0 ? `${hours}h ` : '';

        livesDisplay.textContent = `⌚ ${hoursDisplay}${minutes}m left in your workday`;
    });
}

export const registerStatsViews = () => {
    registerCurrencyView();
    registerLivesView();
}