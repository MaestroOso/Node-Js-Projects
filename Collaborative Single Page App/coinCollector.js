/**
  This Module is used to calculate if a coin has been collected by a player
  This is done by comparing if it is inside the Players boundary
**/
module.exports = function(PlayerX, PlayerY, PlayerWidth, PlayerHeight, CoinX, CoinY){
    if(CoinX >= PlayerX && CoinX <= PlayerX+PlayerWidth && CoinY >= PlayerY && CoinY <= PlayerY+PlayerHeight){
      return true;
    } else{
      return false;
    }
}
