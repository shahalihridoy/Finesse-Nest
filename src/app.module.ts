import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ThrottlerModule } from "@nestjs/throttler";
import { join } from "path";

// Import modules
import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CartModule } from "./modules/cart/cart.module";
import { HomeModule } from "./modules/home/home.module";
import { MenuModule } from "./modules/menu/menu.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { PreorderModule } from "./modules/preorder/preorder.module";
import { ProductsModule } from "./modules/products/products.module";
import { ShopModule } from "./modules/shop/shop.module";
import { UploadModule } from "./modules/upload/upload.module";
import { UsersModule } from "./modules/users/users.module";
import { WishlistModule } from "./modules/wishlist/wishlist.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ]),

    // Static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
      serveRoot: "/uploads"
    }),

    // Database
    DatabaseModule,

    // Feature modules
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    HomeModule,
    ShopModule,
    MenuModule,
    PreorderModule,
    NotificationsModule,
    UploadModule,
    WishlistModule
  ],
  controllers: [AppController]
})
export class AppModule {}
